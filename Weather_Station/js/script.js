(function(){
  //indicates if the update is paused or not
  var isStopped = false;
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
        $stationFigure.append($("<figcaption>").text(allStationsNews[i].temperature + " °C ")
                                            .append($("<img>").attr("src",(allStationsNews[i].weather_icon != null ? allStationsNews[i].weather_icon.icon : ""))));
        var $stationInformation = $("<div>");
        $stationInformation.addClass("figcap");
        $newStation.append($stationInformation);
        setTimeout(update,30000);
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
    for (var i = 0;i < allStationsNews.length; i++) {
      $($accordions[i]).text(allStationsNews[i].station.name);
      $($panelInformation[i]).text(allStationsNews[i].temperature + " °C ");
      $($panelInformationIcon[i]).attr("src",(allStationsNews[i].weather_icon != null ? allStationsNews[i].weather_icon.icon : ""));
    }
    if (!isStopped) {
      setTimeout(update,30000);
    }
  })
  .fail(function(jqXHR, textStatus){
    alert('Request failed: ' + textStatus);
  });
}

$("#pauseUpdate").click(function(){
    if (!isStopped) {
        isStopped = true;
        console.log(isStopped);
    }else {
      isStopped = false;
      console.log(isStopped);
      update();
    }
});
})()
