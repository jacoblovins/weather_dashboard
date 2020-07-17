var cities = ["atlanta", "cincinnati", "orlando", "austin"];

$("#submit").on("click", function (event) {
    event.preventDefault();

    var city = $("#cityInput").val().trim();
    
    
    // Adding city from the textbox to our array
    cities.push(city);
    
    getCityInfo(city);
    
    // Calling renderButtons which handles the processing of our cities array
    renderButtons();
});

// Here we run our AJAX call to the OpenWeatherMap API
function getCityInfo(city) {
    
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=6dd517d7d80637aeefd4b8c64f476918";
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        // We store all of the retrieved data inside of an object called "response"
        .then(function (response) {

            // Log the queryURL
            console.log(queryURL);

            // Log the resulting object
            console.log(response);

            // Transfer content to HTML
            $(".city").text(response.name);
            $(".wind").text("Wind Speed: " + response.wind.speed);
            $(".humidity").text("Humidity: " + response.main.humidity);

            // Convert the temp to fahrenheit
            var tempF = (response.main.temp - 273.15) * 1.80 + 32;

            // add temp content to html
            $(".temp").text("Temperature: " + tempF.toFixed(1) + " \xB0F");

            // Log the data in the console as well
            console.log("Wind Speed: " + response.wind.speed);
            console.log("Humidity: " + response.main.humidity);
            console.log("Temperature (F): " + tempF);
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
        
        a.click(function(){
            console.log("clicked");
            console.log($(this).text());
            getCityInfo($(this).text());
        })
    }
}
// Calling the renderButtons function to display the initial buttons
renderButtons();
