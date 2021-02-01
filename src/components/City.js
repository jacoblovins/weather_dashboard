import React from 'react'
import './city.css'

function City() {

    const renderButtons = () => {
        $("#buttons-view").empty();
    
        // Looping through the array of cities and generating 
        // buttons for each city in the array
        for (let i = 0; i < cities.length; i++) {
    
            const a = $("<button>");
            a.addClass("city-btns d-block");
            a.attr("data-name", cities[i]);
            a.text(cities[i]);
            $("#buttons-view").append(a);
    
            // get the weather for the city button clicked
            a.click(function () {
                citySearch = "q=" + $(this).text();
                getCityInfo(citySearch);
            });
        }
    }
    
    return (
        <div>
            
        </div>
    )
}

export default City
