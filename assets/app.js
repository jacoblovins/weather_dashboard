var cities = [];

// Run the functions needed when the page is first loaded or refreshed
// Display info for the last item searched from local storage
function appInit() {
    if (localStorage.getItem("cities")) {
        cities = (JSON.parse(localStorage.getItem("cities")));
        var lastItem = "q=" + cities[cities.length - 1];
        getCityInfo(lastItem);
    } else {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            return;
        }
    }
};
appInit();

function showPosition(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    city = "lat=" + lat + "&lon=" + lon;
    getCityInfo(city);
  }


// Adding city from the textbox to our array when submitted
$("#submit").on("click", function (event) {
    event.preventDefault();
    city = $("#cityInput").val()
    if (!city || city.charAt(0).toUpperCase() + city.slice(1) === cities[cities.length - 1]) {
        $("#cityInput").val("");
        return
    } else {
        city = $("#cityInput").val().trim();
        citySearch = "q=" + $("#cityInput").val().trim();
        getCityInfo(citySearch);
        var cityCapitalized = city.charAt(0).toUpperCase() + city.slice(1);
        cities.push(cityCapitalized);
        localStorage.setItem("cities", JSON.stringify(cities));
        $("#cityInput").val("");
    }
});

// First AJAX call to the OpenWeatherMap API to get the current weather
function getCityInfo(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?" + city + "&appid=6dd517d7d80637aeefd4b8c64f476918";

    $.ajax({
        url: queryURL,
        method: "GET",
        error: function() {
            alert("Please enter a valid city name!");
            cities.pop();
            localStorage.setItem("cities", JSON.stringify(cities));
            return; 
        }
    }).then(function (response) {
        renderButtons();

        // Fill current city name and date in the html
        $(".city").text(response.name);
        var strDate = moment().format('L');
        $(".date").text("(" + strDate + ")");

        // Weather icon
        var iconCode = (response.weather[0].icon);
        var iconurl = "http://openweathermap.org/img/w/" + iconCode + ".png";
        $('.wIcon').attr('src', iconurl);

        // Convert the temp to fahrenheit and add it to the html
        // along with the humidity and wind speed
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        $(".temp").text("Temperature: " + tempF.toFixed(1) + " \xB0F");
        $(".humidity").text("Humidity: " + response.main.humidity + "%");
        $(".wind").text("Wind Speed: " + response.wind.speed + " MPH");

        // grab latitude and longitude from the current weather request
        // to use in the one call request
        var lat = response.coord.lat
        var lon = response.coord.lon

        // second AJAX request to get UVI and forecast
        queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,minutely&appid=6dd517d7d80637aeefd4b8c64f476918";
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            // Grab the UV index and add classes to the html
            // depending on the UVI number
            var uvi = response.current.uvi;
            $("#uvIndex").removeClass();

            if (uvi <= 2.9) {
                $("#uvIndex").addClass("good");
            } else if (uvi >= 3 && uvi <= 7.9) {
                $("#uvIndex").addClass("medium");
            } else {
                $("#uvIndex").addClass("bad");
            };

            $("#uvIndex").text(response.current.uvi);


            // forecast blocks
            var forecastDiv = $(".forecast");
            var row = $("<div>");
            row.addClass("row");
            forecastDiv.html(row);

            for (var i = 1; i < 6; i++) {
                var column = $("<div>");
                column.addClass("col-md-2");

                // Use moment.js to add the date to the top of each block
                var forecastDate = $("<h5>");
                forecastDate.text(moment().add(i, 'days').format('L'));
                column.append(forecastDate);

                // Fill in image, temperature, and humidity under the date of each block
                var weatherImage = $("<img>");
                var forecastIcon = response.daily[i].weather[0].icon;
                var imageSource = "http://openweathermap.org/img/w/" + forecastIcon + ".png";
                weatherImage.attr("src", imageSource);
                column.append(weatherImage);

                var forecastTemp = $("<p>");
                var findTemp = response.daily[i].temp.day;
                var convertTemp = (findTemp - 273.15) * 1.80 + 32;
                forecastTemp.text("Temp: " + convertTemp.toFixed(2) + " \xB0F");
                column.append(forecastTemp);

                var forecastHum = $("<p>");
                forecastHum.text("Humidity: " + response.daily[i].humidity + " %")
                column.append(forecastHum);

                // append each block to the row
                row.append(column);
            }
        });
    });
}

function renderButtons() {
    $("#buttons-view").empty();

    // Looping through the array of cities and generating 
    // buttons for each city in the array
    for (var i = 0; i < cities.length; i++) {

        var a = $("<button>");
        a.addClass("city-btn d-block");
        a.attr("data-name", cities[i]);
        a.text(cities[i]);
        $("#buttons-view").append(a);

        // get the weather for the city button clicked
        a.click(function () {
            citySearch = "q=" + $(this).text()
            getCityInfo(citySearch);
        })
    }
}


