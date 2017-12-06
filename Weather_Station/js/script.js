(function(){
  var allStationsNews = {};
  $.ajax({
    method: "GET",
    url : "https://www.torinometeo.org/api/v1/realtime/data/",
    data: "json"
  })
  .done(function(response){
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
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
                //(allStationsNews[i].station.webcam != null ? allStationsNews[i].station.webcam : ""));
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

})()
