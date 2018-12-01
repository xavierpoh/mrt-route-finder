import React, { Component } from 'react';
import findRoutes from '../routing/findRoutes';
import './App.css';

// TODO: get {lat, lng} value of user input and pass it to findRoutes.js

// This is only a placeholder to demonstrate the Google Maps API.
// You should reorganize and improve it.

class App extends Component {
    componentDidMount() {
        setTimeout(() => {
            const { SearchBox } = window.google.maps.places;
            const originSearch = new SearchBox(document.getElementById('origin'));
            originSearch.addListener('places_changed', () => {
                const places = originSearch.getPlaces();
                const location = places[0].geometry.location.toJSON();
                console.log(location);
            });
        }, 100);
    }

    render() {
        return (
            <div id='app'>
                <input id='origin' placeholder='Origin' />
                <input id='destination' placeholder='Destination' />
                <button>Find routes</button>
                <div id='results' />
            </div>
        )
    }
}

export default App;
