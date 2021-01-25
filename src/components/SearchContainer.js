import React, {useRef} from 'react'
import City from './City'
import './searchContainer.css'


function SearchContainer() {


    return (
        <div>
            <section className="col-md-3">
                <h4 id="searchLabel">Search for a City:</h4>
                <form>
                    <input id="cityInput" type="text"/>
                    <button id="submit"><i className="fas fa-search"></i></button>
                </form>
                {/* Map through multiple City components here */}
            </section>
        </div>
    )
}

export default SearchContainer
