import React, {useState, useEffect} from 'react'
import './App.css';
import SearchContainer from './components/SearchContainer';
import WeatherContainer from './components/WeatherContainer';

function App() {

  useEffect(() => {
    
  }, [])


  return (
    <div className="App">
     <SearchContainer/>
     <WeatherContainer/>
    </div>
  );
}

export default App;
