(function(){
  var allStationsNews = {};
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
        creaSelect(allStationsNews[i].station.nation.name);
        console.log(allStationsNews[i]);
        var $newAccordion = $("<div>");
        $newAccordion.addClass("accordion");
        $newAccordion.text(allStationsNews[i].station.name);
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
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            var $panel = $(panel);
            $panel.slideToggle("slow");
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
  filtraStati();
});
//richiama la funzione filtraStati() quando si preme un tasto in $("#filter-station")
$(document).ready(function(){
      $("#filter-station").on("keyup", function() {

    filtraStati();
  });
});
//questa funzione filtra le varie stazioni in base allo stato scelto e/o in base alla parola ricercata
function filtraStati(){

      for (var j = 0;j < allStationsNews.length; j++) {
        if($("#filter-country").val()=="Italia"){
                    $(".accordion").css("display","none");
                    $(".accordion-italy").css("display","block");
                  }//fine filtro italia
       if($("#filter-country").val()=="Francia"){
                            $(".accordion").css("display","none");
                    $(".accordion-france").css("display","block");
                  }//fine filtro francia
        if($("#filter-country").val()=="Svizzera"){
                    $(".accordion").css("display","none");
                    $(".accordion-switzerland").css("display","block");
                  }//fine filtro svizzera
        if($("#filter-country").val()=="all"){
                    $(".accordion").show();
        }//fine filtro all
      }//fine cicloprova

var value = $("#filter-station").val().toLowerCase();
     for(key in allStationsNews){
         $($(".accordion")[key]).toggle($($(".accordion")[key]).text().toLowerCase().indexOf(value) > -1
          && ($("#filter-country").val()=="all" || $("#filter-country").val()==allStationsNews[key].station.nation.name) );
       }
    }//fine funzione





})()
