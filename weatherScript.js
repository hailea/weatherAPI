(function () {
    var URL = "", url, lati = "", long = "", appid, timeStamp = "";
    url = "http://api.openweathermap.org/data/2.5/weather?";
    appid = "825a4440b5b1f8c7a0eb62c6be7b405f";

    var $temp = $("#lTemp");
    var $humid = $("#lHumidity");
    var $wind = $("#lWindSpeed");
    var $cond = $("#lCondition");
    var $country = $("#lCountry");
    var $state = $("#lState");
    var $icon = $("#icon");
    var $c = $("#celcius");
    var $f = $("#fahereneit");
    var $time = $("#getTime");
    getLocation();


    var xHttp = new XMLHttpRequest();
    var $update =$("#updateWeatherBtn");
    //Get current location weather URL
    $update.on("click", getLocation);
    function getLocation() {
        var currentTime = new Date();
        $time.html(currentTime.toDateString());
        lati = 0; long = 0;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success,error);
        }
        function success(position) {
            lati = position.coords.latitude;
            long = position.coords.longitude;
            urlUpdate(lati, long);
            console.log(lati + " " + long);

        };
            function error(err) {
                console.warn(`ERROR(${err.code}): ${err.message}`);
            };
        }
    
    
    //get full url
    function urlUpdate(lat, lon) {
        timeStamp = "";
        URL = url + "lat=" + lat + "&lon=" + lon + "&appid=" + appid;
        console.log(URL);
        timeStamp = ((/\?/).test(URL) ? "&" : "?") + (new Date()).getTime();
        URL += timeStamp;
        console.log(URL);
        openConnection(URL);
    };
    //open connection and send request
    function openConnection(url){
        
        xHttp.onreadystatechange = checkStatus;
        xHttp.open("GET", url);
        xHttp.setRequestHeader("content-type", "text/plain");
        xHttp.send();
        
    }
    //check the status of the network 
    function checkStatus() {
        try{     
        if (xHttp.readyState === 4 && xHttp.status === 200) {
            var requestData = JSON.parse(xHttp.responseText);
            
            workWithData(requestData);
        }
        else {
            console.log("ready state: " + xHttp.readyState + "....status: " + xHttp.status);
        }

    }
    catch (e) {
        alert('Caught Exception: ' + e.description);
    }

    }
    //Display 
    function workWithData(data) {
        //Conversion from kelvein to fahereneit and from kelvein to celcius
        var TK, temperature, TC, TF;
        TK = data.main.temp;
        TF = Math.floor(9 / 5 * (TK - 273.15) + 32);
        TC = Math.floor(TK - 273.15);
        toFahereneit();
        $f.on("mouseenter", toFahereneit);
        $f.on("click", toFahereneit);
        $c.on("mouseleave", toFahereneit);
        $c.on("mouseenter", toCelcius); $c.on("click", toCelcius);
        function toFahereneit() {
            temperature = TF; 
            $c.removeClass("TCTF");
            $f.addClass("defaultTemp");
            $f.addClass("TCTF");
            $temp.html(temperature);
        };
        function toCelcius() {
            temperature = TC; 
            $f.removeClass("TCTF");
            $f.removeClass("defaultTemp");
            $c.addClass("TCTF");
            $temp.html(temperature);
        };
        var weatherImages = "https://openweathermap.org/img/w/"
        var iconimg = data.weather[0].icon + ".png";
        var img = weatherImages + iconimg;
        var imgIcon = '\<img id=\"icon\"  src=' + img + ' \/\>';
        var imgBK = "http:\/\/openweathermap.org\/img\/w\/" + iconimg;
        bkImages(imgBK);
        $(".liveBKImg").css({
        "background":"url(" + imgBK + ") repeat",
        "width" : "90%",
        "height": "90%"
        });
       
        $humid.html(data.main.humidity + " %");
        $wind.html(data.wind.speed + " MPH");
        $cond.html(data.weather[0].description);
        $country.html(data.sys.country);
        $state.html(data.name);
        $(".iconContainer").html(imgIcon);
    }
    //to change background images
    function bkImages(imgBK) {
        $(".weatherContainer").addClass("liveBKImg");

    }
}());
