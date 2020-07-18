var cities = ["Atlanta", "Cincinnati", "Orlando", "Austin"];

$("#submit").on("click", function (event) {
    event.preventDefault();

    // Adding city from the textbox to our array
    var city = $("#cityInput").val().trim();
    cities.push(city);
    getCityInfo(city);
    renderButtons();
});

// Here we run our AJAX call to the OpenWeatherMap API
function getCityInfo(city) {

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=6dd517d7d80637aeefd4b8c64f476918";
    $.ajax({
        url: queryURL,
        method: "GET"

        // We store all of the retrieved data inside of an object called "response"
    }).then(function (response) {

        // Log the queryURL
        console.log(queryURL);

        // Log the resulting object
        console.log(response);

        // Transfer content to HTML
        $(".city").text(response.name);

        
        var strDate = moment().format('L');
        $(".date").text(strDate);

        var iconCode = (response.weather[0].icon);
        var iconurl = "http://openweathermap.org/img/w/" + iconCode + ".png";
        $('.wIcon').attr('src', iconurl);

        // Convert the temp to fahrenheit
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;

        // add temp content to html
        $(".temp").text("Temperature: " + tempF.toFixed(1) + " \xB0F");
        $(".wind").text("Wind Speed: " + response.wind.speed + " MPH");
        $(".humidity").text("Humidity: " + response.main.humidity + " %");

        var lat = response.coord.lat
        var lon = response.coord.lon
        queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,minutely&appid=6dd517d7d80637aeefd4b8c64f476918";
        
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            var uvi = response.current.uvi;
            
            $("#uvIndex").removeClass("good");
            $("#uvIndex").removeClass("medium");
            $("#uvIndex").removeClass("bad");
           
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
            
            for (var i = 0; i < 5; i++) {
                var column = $("<div>");
                column.addClass("col-md-2");
                
                var forecastDate = $("<h5>");
                
                forecastDate.text(moment().add(i + 1, 'days').format('L'));
                column.append(forecastDate);
                
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
                
                row.append(column);
            }
        });
    });
}

function renderButtons() {

    $("#buttons-view").empty();

    // Looping through the array of cities
    for (var i = 0; i < cities.length; i++) {

        // Dynamicaly generating buttons for each city in the array
        var a = $("<button>");
        // Adding a class of city-btn and bootstrap styling to our button
        a.addClass("city-btn d-block");
        // Adding a data-attribute
        a.attr("data-name", cities[i]);
        // Providing the initial button text
        a.text(cities[i]);
        // Adding the button to the buttons-view div
        $("#buttons-view").append(a);

        a.click(function () {
            getCityInfo($(this).text());
        })
    }
}
// Calling the renderButtons function to display the initial buttons
renderButtons();
