(function(){
  //indicates if the update is paused or not
  var isStopped = false;
  var timeoutId = 0;
  var allStationsNews = {};
  var date = new Date();
  $("#time").text(date.toUTCString());
  $.ajax({
    method: "GET",
    url : "https://www.torinometeo.org/api/v1/realtime/data/",
    data: "json"
  })
  .done(function(response){
    $("#loading").hide();
    allStationsNews = response;
    console.log(allStationsNews);
      for (var i = 0;i < allStationsNews.length; i++) {
        console.log(allStationsNews[i]);
        var $newAccordion = $("<div>");
        $newAccordion.addClass("accordion");
        $newAccordion.text(allStationsNews[i].station.name);
        $newFlag = $("<img>");
        $newFlag.addClass("flag");
        $newAccordion.append($newFlag);
        switch (allStationsNews[i].station.nation.name) {
          case "Italia":  $newFlag.attr("src","img/italy.png");
                          break;
          case "Francia": $newFlag.attr("src","img/france.png");
                          break;
          case "Svizzera":$newFlag.attr("src","img/switzerland.png");
                          break;
        }
        $("body").append($newAccordion);
        $newAccordion.click(function(){
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            var $panel = $(panel);
            $panel.stop();
            if($panel.hasClass("open") == true){
                $panel.removeClass("open");
                $panel.slideUp();
            }  else {
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
        $stationImg.attr("src",(allStationsNews[i].station.webcam != "" ? allStationsNews[i].station.webcam : allStationsNews[i].station.image_url));
        $stationFigure.append($($stationImg));
        var colorFigcaption = "";
        if (allStationsNews[i].temperature > 10) {
            colorFigcaption = "red";
        }
        else {
          colorFigcaption = "#90b4ed";
        }
        $stationFigure.append($("<figcaption>").text(allStationsNews[i].temperature + " °C ")
                                                .css("color",colorFigcaption)
                                            .append($("<img>").attr("src",(allStationsNews[i].weather_icon != null ? allStationsNews[i].weather_icon.icon : ""))));

        var $stationInformation = $("<div>");
        $stationInformation.addClass("figcap");
        $newStation.append($stationInformation);
        $newStation.append($("<div>").html("City: " + allStationsNews[i].station.city+"<br>Province : " + allStationsNews[i].station.province.name + "<br>Region : " +allStationsNews[i].station.region.name + "<br>Nation : "+allStationsNews[i].station.nation.name)
                                      .addClass("nationInformation"));
        timeoutId = setTimeout(update,30000);
    }
  })
  .fail(function(jqXHR, textStatus){
    alert('Request failed: ' + textStatus);
  });

  $(document).ready(function(){
  $("#filter-station").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $(".accordion").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
    /*$(".panel").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });*/
  });
});
function update(){
  $.ajax({
    method: "GET",
    url : "https://www.torinometeo.org/api/v1/realtime/data/",
    data: "json"
  })
  .done(function(response){
    date = new Date();
    $("#time").text(date.toUTCString());
    allStationsNews = response;
    var $accordions = $(".accordion");
    var $panelInformation = $(".panel figcaption");
    var $panelInformationIcon = $(".panel figcaption img");
    var $nationInformation = $("nationInformation");
    for (var i = 0;i < allStationsNews.length; i++) {
      $($accordions[i]).text(allStationsNews[i].station.name);
      $($panelInformation[i]).text(allStationsNews[i].temperature + " °C ");
      if (allStationsNews[i].temperature > 10) {
          $($panelInformation[i]).css("color","red");
      }
      else {
        $($panelInformation[i]).css("color","#90b4ed");
      }
      $($panelInformationIcon[i]).attr("src",(allStationsNews[i].weather_icon != null ? allStationsNews[i].weather_icon.icon : ""));
      $nationInformation.html("City: " + allStationsNews[i].station.city+"<br>Province : " + allStationsNews[i].station.province.name + "<br>Region : " +allStationsNews[i].station.region.name + "<br>Nation : "+allStationsNews[i].station.nation.name);
    }
    timeoutId = setTimeout(update,30000);  
  })
  .fail(function(jqXHR, textStatus){
    alert('Request failed: ' + textStatus);
  });
}

$("#pauseUpdate").click(function(){
    if (!isStopped) {
      clearTimeout(timeoutId);
    }else {
      isStopped = false;
      timeoutId = setTimeout(update,30000);
    }
});
})()
