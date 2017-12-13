/*
 *@file: script.js
 *@author: Michele Brescia, Loredana Frontino , Simone Marca, Lorenzo Siciliano
 *@group : Group 6
 *@exercise : Weather Station
 */
(function(){
  //indicates if the update is paused or not
  var isStopped = false;
  var timeoutId = 0;
  var date = new Date();
  var allStationsNews = {}
  $("#pauseUpdate").prop('disabled', true);
  $("#time").text(printData(date));

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
      timerId = setTimeout(update,30000);
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
      ////////////////////////////// ACCORDION ANIMATION  ///////////////////////////////////
     // calls the function when an accordion is clicked
      $newAccordion.click(function(){
        var accordion = this;
        var $accordion = $(accordion);
        if($accordion.hasClass("clicked") == true){
             $accordion.removeClass("clicked");
         }  else {
             $accordion.addClass("clicked");
           }
      });
      $newAccordion.click(function(){

          var allAccordions = $(".accordion")
          var allPanels = $(".panel");
          for (var i = 0; i < allPanels.length; i++) {
            if ($(allPanels[i]).hasClass("open") == true) {
              $(allPanels[i]).stop();
              $(allPanels[i]).removeClass("open");
              $(allPanels[i]).slideUp();
              $(allAccordions[i]).removeClass("clicked");
            }
           }
           var panel = this.nextElementSibling;
          // opening and closing animation of the accordion
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

      // if it does not find the image on the server, insert a placeholder in its place
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
      $stationInformation.append($('<p>').html("City: " + information[i].station.city+"<br>Province : " + information[i].station.province.name + "<br>Region : " +information[i].station.region.name + "<br>Nation : "+information[i].station.nation.name)
                                    .addClass("nationInformation"));

      var $otherInformation = $("<div>");
      $otherInformation.addClass("otherInformation");
      $stationInformation.append($otherInformation);
      $otherInformation.append($('<h2>').text("dewpoint"));
      $otherInformation.append($('<h2>').text("pressure"));
      $otherInformation.append($('<h2>').text("rain"));
      var $otherInformation2 = $("<div>");
      $otherInformation2.addClass("otherInformation");
      $stationInformation.append($otherInformation2);
      $otherInformation2.append($('<p>').text(information[i].dewpoint).addClass("info1"));
      $otherInformation2.append($('<p>').text(information[i].pressure).addClass("info2"));
      $otherInformation2.append($('<p>').text(information[i].rain).addClass("info3"));

      var $link = $("<a>");
      //create a link to Google Maps for selected location
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
    $("#time").text(printData(date));
    var $accordions = $(".accordion");
    var $panelInformation = $(".panel figcaption");
    var $moreInformation1 = $(".info1");
    var $moreInformation2 = $(".info2");
    var $moreInformation3 = $(".info3");

    for (var i = 0;i < allStationsNews.length; i++) {
      $newFlag = $("<img>");
      $newFlag.addClass("flag");
      $($accordions[i]).append($newFlag);
      switch (response[i].station.nation.name) {
        case "Italia":  $newFlag.attr("src","img/italy.png");
                        $($accordions[i]).addClass("accordion-italy");
                        break;
        case "Francia": $newFlag.attr("src","img/france.png");
                        $($accordions[i]).addClass("accordion-france");
                        break;
        case "Svizzera":$newFlag.attr("src","img/switzerland.png");
                        $($accordions[i]).addClass("accordion-switzerland");
                        break;
      }
      $($panelInformation[i]).text(response[i].temperature + " °C ").append($("<img>").attr("src",(response[i].weather_icon != null ? response[i].weather_icon.icon : "")));
      if (allStationsNews[i].temperature > 10) {
          $($panelInformation[i]).css("color","red");
      }
      else {
        $($panelInformation[i]).css("color","#90b4ed");
      }
    $($moreInformation1[i]).text(response[i].dewpoint);
    $($moreInformation2[i]).text(response[i].pressure);
    $($moreInformation3[i]).text(response[i].rain);
    }
  })
  .then(function(){
    if (!isStopped) {
    timerId = setTimeout(update,30000);
    }
  })
  .fail(function(jqXHR, textStatus){
    alert('Request failed: ' + textStatus);
  })
}

//pause the update or restart it
$("#pauseUpdate").click(function(){
    if (!isStopped) {
      $("#pauseUpdate img").attr("src","img/play.png");
      isStopped = true;
      clearTimeout(timeoutId);
    }else {
      $("#pauseUpdate img").attr("src","img/play.png");
      isStopped = false;
      timerId = setTimeout(update,30000);
    }
});
// return a string with the format of the date
function printData(date){
  var str = "";
  switch (date.getDay()) {
    case 0: str += "Dom "
            break;
    case 1: str += "Lun "
            break;
    case 2: str += "Mar "
            break;
    case 3: str += "Mer "
            break;
    case 4: str += "Gio "
            break;
    case 5: str += "Ven "
            break;
    case 6: str += "Sab "
            break;
    case 0: str += "Lun "
            break;
    default: str += "";
  }
  if ( date.getDate() > 9) {
    str += date.getDate()
  }
  else{
    str += "0" + date.getDate();
  }
  str += "/";
  if ( date.getMonth() > 9) {
    str += date.getMonth()
  }
  else{
    str += "0" + date.getMonth();
  }
  str += "/";
  str += date.getFullYear() + " ";
  if ( date.getHours() > 9) {
    str += date.getHours()
  }
  else{
    str += "0" + date.getHours();
  }
  str += ":";
  if ( date.getMinutes() > 9) {
    str += date.getMinutes()
  }
  else{
    str += "0" + date.getMinutes();
  }
  str += ":";
  if ( date.getSeconds() > 9) {
    str += date.getSeconds()
  }
  else{
    str += "0" + date.getSeconds();
  }
  return str;
}

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
  var value = $("#filter-station").val().toLowerCase();
       for(key in information){
          var checkCountry =  $("#filter-country").val()==information[key].station.nation.name;


          $($(".accordion")[key]).toggle($($(".accordion")[key]).text().toLowerCase().indexOf(value) > -1
          && ($("#filter-country").val()=="all" || checkCountry==true) );

          if($($(".accordion")[key]).css('display') == 'none') {
                         $($(".panel")[key]).hide();
          }
          if($($(".accordion")[key]).css('display') != 'none' && $($(".accordion")[key]).hasClass("clicked")) {
                         $($(".panel")[key]).show();
          }
         }
      }
})()
