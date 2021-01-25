import React from 'react'
import './current.css'


function Current() {
    return (
        <div>
            <section classNameName="col-md-9 currentWeather">
            <div className="card">
                <div className="card-body">
                    <h3 className="city d-inline">Please Wait... </h3>
                    <h3 className="date d-inline"></h3>
                    <img className="wIcon d-inline" alt="weather"/> 

                    <p className="temp">Temperature: </p>
                    <p className="humidity">Humidity: </p>
                    <p className="wind">Wind Speed: </p>
                    <p>UV Index: <span id="uvIndex"></span></p>
                </div>
            </div>
            </section>
        </div>
    )
}

export default Current
