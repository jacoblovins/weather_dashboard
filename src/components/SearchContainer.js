import React, { useRef } from 'react'
import City from './City'
import './searchContainer.css'


function SearchContainer() {

    let cities = [];
    let lat;
    let lon;

    const showPosition = (position) => {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        city = "lat=" + lat + "&lon=" + lon;
        getCityInfo(city);
    }

    $("#submit").on("click", (event) => {
        event.preventDefault();
        city = $("#cityInput").val();
        if (!city || city.charAt(0).toUpperCase() + city.slice(1) === cities[cities.length - 1]) {
            $("#cityInput").val("");
            return;
        } else {
            city = $("#cityInput").val().trim();
            citySearch = "q=" + $("#cityInput").val().trim();
            getCityInfo(citySearch);
            const cityCapitalized = city.charAt(0).toUpperCase() + city.slice(1);
            cities.push(cityCapitalized);
            localStorage.setItem("cities", JSON.stringify(cities));
            $("#cityInput").val("");
        }
    });

    const getCityInfo = (city) => {
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?" + city + "&appid=6dd517d7d80637aeefd4b8c64f476918";

        $.ajax({
            url: queryURL,
            method: "GET",
            error: () => {
                alert("Please enter a valid city name!");
                cities.pop();
                localStorage.setItem("cities", JSON.stringify(cities));
                return;
            }
        }).then(response => {
            renderButtons();

            // Fill current city name and date in the html
            $(".city").text(response.name);
            const strDate = moment().format('L');
            $(".date").text("(" + strDate + ")");

            // Weather icon
            const iconCode = (response.weather[0].icon);
            const iconurl = "http://openweathermap.org/img/w/" + iconCode + ".png";
            $('.wIcon').attr('src', iconurl);

            // Convert the temp to fahrenheit and add it to the html
            // along with the humidity and wind speed
            const tempF = (response.main.temp - 273.15) * 1.80 + 32;
            $(".temp").text("Temperature: " + tempF.toFixed(1) + " \xB0F");
            $(".humidity").text("Humidity: " + response.main.humidity + "%");
            $(".wind").text("Wind Speed: " + response.wind.speed + " MPH");

            // grab latitude and longitude from the current weather request
            // to use in the one call request
            lat = response.coord.lat;
            lon = response.coord.lon;

            // second AJAX request to get UVI and forecast
            queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,minutely&appid=6dd517d7d80637aeefd4b8c64f476918";
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(response => {

                // Grab the UV index and add classes to the html
                // depending on the UVI number
                const uvi = response.current.uvi;
                $("#uvIndex").removeClass();

                if (uvi <= 2.9) {
                    $("#uvIndex").addClass("good");
                } else if (uvi >= 3 && uvi <= 7.9) {
                    $("#uvIndex").addClass("medium");
                } else {
                    $("#uvIndex").addClass("bad");
                }

                $("#uvIndex").text(response.current.uvi);


                // forecast blocks
                const forecastDiv = $(".forecast");
                const row = $("<div>");
                row.addClass("row");
                forecastDiv.html(row);

                for (let i = 1; i < 6; i++) {
                    const column = $("<div>");
                    column.addClass("col-md-2");

                    // Use moment.js to add the date to the top of each block
                    const forecastDate = $("<h5>");
                    forecastDate.text(moment().add(i, 'days').format('L'));
                    column.append(forecastDate);

                    // Fill in image, temperature, and humidity under the date of each block
                    const weatherImage = $("<img>");
                    const forecastIcon = response.daily[i].weather[0].icon;
                    const imageSource = "http://openweathermap.org/img/w/" + forecastIcon + ".png";
                    weatherImage.attr("src", imageSource);
                    column.append(weatherImage);

                    const forecastTemp = $("<p>");
                    const findTemp = response.daily[i].temp.day;
                    const convertTemp = (findTemp - 273.15) * 1.80 + 32;
                    forecastTemp.text("Temp: " + convertTemp.toFixed(2) + " \xB0F");
                    column.append(forecastTemp);

                    const forecastHum = $("<p>");
                    forecastHum.text("Humidity: " + response.daily[i].humidity + " %");
                    column.append(forecastHum);

                    // append each block to the row
                    row.append(column);
                }
            });
        });
    }



    return (
        <div>
            <section className="col-md-3">
                <h4 id="searchLabel">Search for a City:</h4>
                <form>
                    <input id="cityInput" type="text" />
                    <button id="submit"><i className="fas fa-search"></i></button>
                </form>
                {/* Map through multiple City components here */}
            </section>
        </div>
    )
}

export default SearchContainer
