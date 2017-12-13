(function(){
  //indicates if the update is paused or not
  var isStopped = false;
  var timeoutId = 0;
  var date = new Date();
  var allStationsNews = {}
  $("#pauseUpdate").prop('disabled', true);
  $("#time").text(date.toUTCString());

  //server call to torinometeo to take the json with all the information
  $.ajax({
    method: "GET",
    url : "https://www.torinometeo.org/api/v1/realtime/data/",
    data: "json"
  })
  .done(function(response){
    $("#pauseUpdate").prop('disabled', false);
    setInformation(response);
  })
  .then(function(){
      timerId = setTimeout(update,10000);
  })
  .fail(function(jqXHR, textStatus){
    // server call to jsonBlob if torinometeo is not accessible
    $.ajax({
      method: "GET",
      url : "https://jsonblob.com/api/jsonBlob/8f73f269-d924-11e7-a24a-991ece7b105b",
      data: "json"
    })
    .done(function(response){
      setInformation(response);
    })
    .fail(function(jqXHR, textStatus){
       alert('Request failed: ' + textStatus);
    });
  });
/*
 *Set the information taken from the API in the DOM
 *@param{Objects} information - the information taken from the API
 */
function setInformation(information){
  $("#loading").hide();
  allStationsNews = information;
    for (var i = 0;i < information.length; i++) {
      creaSelect(information[i].station.nation.name);
      var $newAccordion = $("<div>");
      $newAccordion.addClass("accordion");
      $newAccordion.text(information[i].station.name);
      $newFlag = $("<img>");
      $newFlag.addClass("flag");
      $newAccordion.append($newFlag);
      switch (information[i].station.nation.name) {
        case "Italia":  $newFlag.attr("src","img/italy.png");
                        $newAccordion.addClass("accordion-italy");
                        break;
        case "Francia": $newFlag.attr("src","img/france.png");
                        $newAccordion.addClass("accordion-france");
                        break;
        case "Svizzera":$newFlag.attr("src","img/switzerland.png");
                        $newAccordion.addClass("accordion-switzerland");
                        break;
      }

      $("body").append($newAccordion);
      $newAccordion.click(function(){

           var allAccordions = $(".accordion")
           var allPanels = $(".panel");
           for (var i = 0; i < allPanels.length; i++) {
             if ($(allPanels[i]).hasClass("open") == true) {
               $(allPanels[i]).stop();
               $(allPanels[i]).removeClass("open");
               $(allPanels[i]).slideUp();
             }
           }
           var panel = this.nextElementSibling;
           var $panel = $(panel);
           if($panel.hasClass("open") == true){
                $panel.stop();
                $panel.removeClass("open");
                $panel.slideUp();
            }  else {
                $panel.stop();
                $panel.addClass("open");
                $panel.slideToggle();
              }
      });
      var $newStation = $("<div>");
      $newStation.addClass("panel");
      $("body").append($newStation);
      var $stationFigure = $("<figure>");
      $stationFigure.addClass("backimg");
      $newStation.append($stationFigure);
      $stationImg = $("<img>");
      $stationImg.attr("src",(information[i].station.webcam != "" ? information[i].station.webcam : information[i].station.image_url));
      $stationImg.bind("error", function(){$(this).attr('src', 'img/Placeholder.png')});
      $stationFigure.append($($stationImg));
      var colorFigcaption = "";
      if (information[i].temperature > 10) {
          colorFigcaption = "red";
      }
      else {
        colorFigcaption = "#90b4ed";
      }
      $stationFigure.append($("<figcaption>").text(information[i].temperature + " °C ")
                                              .css("color",colorFigcaption)
                                          .append($("<img>").attr("src",(information[i].weather_icon != null ? information[i].weather_icon.icon : ""))));

      var $stationInformation = $("<div>");
      $stationInformation.addClass("figcap");
      $newStation.append($stationInformation);
      $newStation.append($("<div>").html("City: " + information[i].station.city+"<br>Province : " + information[i].station.province.name + "<br>Region : " +information[i].station.region.name + "<br>Nation : "+information[i].station.nation.name)
                                    .addClass("nationInformation"));
      var $link = $("<a>");
      $link.text("Link a Google Maps")
      $link.attr("href", "https://www.google.it/maps/place/"+ information[i].station.name)
      $link.addClass("linkToGMaps");
      $stationInformation.append($link);
  }
}
/*
 * Update the dom with new information
 */
function update(){
  $.ajax({
    method: "GET",
    url : "https://www.torinometeo.org/api/v1/realtime/data/",
    data: "json"
  })
  .done(function(response){
    allStationsNews = response;
    date = new Date();
    $("#time").text(date.toUTCString());
    var $accordions = $(".accordion");
    var $panelInformation = $(".panel figcaption");
    var $panelInformationIcon = $(".panel figcaption img");
    var $nationInformation = $("nationInformation");
    for (var i = 0;i < allStationsNews.length; i++) {
      $($accordions[i]).text(response[i].station.name);
      $($panelInformation[i]).text(response[i].temperature + " °C ");
      if (allStationsNews[i].temperature > 10) {
          $($panelInformation[i]).css("color","red");
      }
      else {
        $($panelInformation[i]).css("color","#90b4ed");
      }
    //  $($panelInformationIcon[i]).attr("src",(allStationsNews[i].weather_icon != null ? allStationsNews[i].weather_icon.icon : ""));
      $nationInformation.html("City: " + response[i].station.city+"<br>Province : " + response[i].station.province.name + "<br>Region : " +response[i].station.region.name + "<br>Nation : "+response[i].station.nation.name);

    }
  })
  .then(function(){
    timerId = setTimeout(update,10000);
  })
  .fail(function(jqXHR, textStatus){
    alert('Request failed: ' + textStatus);
  })
}


$("#pauseUpdate").click(function(){
    if (!isStopped) {
      clearTimeout(timeoutId);
    }else {
      isStopped = false;
      timerId = setTimeout(update,10000);
    }
});

  function creaSelect(nazione){

    if($('#'+nazione)[0]) {
      return;
    }else{
      var $option = $("<option>");
      $option.attr("id",nazione);

      $option.html(nazione);
      $("#filter-country").append($option);
    }


  }


  ////////////////////////////// FILTRO RICERCA  ///////////////////////////////////
  //richiama la funzione filtraStati() quando si cambia il valore di $("#filter-country")
$("#filter-country").change(function(){
  filtraStati(allStationsNews);
});
//richiama la funzione filtraStati() quando si preme un tasto in $("#filter-station")
$(document).ready(function(){
      $("#filter-station").on("keyup", function() {

    filtraStati(allStationsNews);
  });
});
//questa funzione filtra le varie stazioni in base allo stato scelto e/o in base alla parola ricercata
function filtraStati(information){

      // for (var j = 0;j < allStationsNews.length; j++) {
      //   if($("#filter-country").val()=="Italia"){
      //               $(".accordion").css("display","none");

      //               $(".accordion-italy").css("display","block");
      //             }//fine filtro italia
      //  if($("#filter-country").val()=="Francia"){
      //                       $(".accordion").css("display","none");
      //               $(".accordion-france").css("display","block");
      //             }//fine filtro francia
      //   if($("#filter-country").val()=="Svizzera"){
      //               $(".accordion").css("display","none");
      //               $(".accordion-switzerland").css("display","block");
      //             }//fine filtro svizzera
      //   if($("#filter-country").val()=="all"){
      //               $(".accordion").show();
      //   }//fine filtro all


      // }//fine cicloprova
var value = $("#filter-station").val().toLowerCase();

     for(key in information){
var checkCountry =  $("#filter-country").val()==information[key].station.nation.name;

if($($(".accordion")[key]).css("display","none")){
               $($(".panel")[key]).hide();
               console.log("aaaaa");
}
// if($($(".accordion")[key]).show() && $($(".panel .open")[key]).hide()){
//               $($(".panel .open")[key]).show();
// }


         $($(".accordion")[key]).toggle($($(".accordion")[key]).text().toLowerCase().indexOf(value) > -1
          && ($("#filter-country").val()=="all" || checkCountry==true) );






       }
    }//fine funzione
})()
