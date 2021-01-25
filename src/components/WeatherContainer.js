import React from 'react'
import Current from './Current'
import Forecast from './Forecast'
import './weatherContainer.css'


function WeatherContainer() {
    return (
        <div>
            <Current />
            <h4 id="forecastLabel">5-Day Forecast:</h4>
            {/* Map through multiple Forecast components */}
        </div>
    )
}

export default WeatherContainer
