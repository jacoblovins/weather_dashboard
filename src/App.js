import React, {useState, useEffect} from 'react'
import './App.css';
import SearchContainer from './components/SearchContainer';
import WeatherContainer from './components/WeatherContainer';

function App() {

  useEffect(() => {
      if (localStorage.getItem("cities")) {
          cities = (JSON.parse(localStorage.getItem("cities")));
          const lastItem = "q=" + cities[cities.length - 1];
          getCityInfo(lastItem);
      } else {
          if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(showPosition);
          } else {
              return;
          }
      } 
  }, [])


  return (
    <div className="App">
     <SearchContainer/>
     <WeatherContainer/>
    </div>
  );
}

export default App;
