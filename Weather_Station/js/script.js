(function(){
  //indicates if the update is paused or not
  var isStopped = false;
  var timeoutId = 0;
  var date = new Date();
  $("#pauseUpdate").prop('disabled', true);
  $("#time").text(date.toUTCString());
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

function setInformation(information){
  $("#loading").hide();
  console.log(information);
    for (var i = 0;i < information.length; i++) {
      creaSelect(response[i].station.nation.name);
      console.log(information[i]);
      var $newAccordion = $("<div>");
      $newAccordion.addClass("accordion");
      $newAccordion.text(information[i].station.name);
      $newFlag = $("<img>");
      $newFlag.addClass("flag");
      $newAccordion.append($newFlag);
      switch (allStationsNews[i].station.nation.name) {
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
      $link.attr("href", "https://www.google.it/maps/place/"+ allStationsNews[i].station.name)
      $stationInformation.append($link);
  }
}

function update(){
  $.ajax({
    method: "GET",
    url : "https://www.torinometeo.org/api/v1/realtime/data/",
    data: "json"
  })
  .done(function(response){
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
})()
