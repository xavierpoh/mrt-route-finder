import React, { Component } from 'react';
import findRoutes from '../../routing/findRoutes';
import './RoutesFinder.scss';
import SearchBox from './../SearchBox/SearchBox';

// TODO: get {lat, lng} value of user input and pass it to findRoutes.js

const SEARCHBOX = ['origin', 'destination'];

class RoutesFinder extends Component {

  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      originCoordinates: { lat: null, lng: null },
      destinationCoordinates: { lat: null, lng: null },
      suggestedRoutesList: null,
      isLoading: false
    }
  }

  // Handles user input change in Origin and Destination input fields
  handleInputChange(type) {
    console.log('type: ', type);
    // setTimeout(() => {
    //   const { SearchBox } = window.google.maps.places;
    //   const originSearch = new SearchBox(document.getElementById(type));
    //   originSearch.addListener('places_changed', () => {
    //     const places = originSearch.getPlaces();
    //     const location = places[0].geometry.location.toJSON();
    //     console.log(location);
    //     type === 'origin' ? this.setState({ originCoordinates: location }) : this.setState({ destinationCoordinates: location }); 
    //   });
    // }, 100);
  }

  // Gets called when user clicks 'Find Routes' button
  handleSubmit() {
    console.log('find routes!');
    // if(this.checkValidEntry()) {
      console.log('valid address input');
      let suggestedRoutesList = findRoutes({ lat: 1.298593, lng: 103.845909 }, { lat: 1.335419, lng: 103.7837309 });
      // let suggestedRoutesList = findRoutes(this.state.originCoordinates, this.state.destinationCoordinates);
      this.setState({ suggestedRoutesList });
    // } else {
      // TODO: show error message
      // console.log('invalid address input');
    // }

  }

  checkValidEntry() {
    return (this.state.originCoordinates.lat && this.state.originCoordinates.lng && this.state.destinationCoordinates.lat && this.state.destinationCoordinates.lng);
  }

  render() {
    return (
      <div className="routes-finder">

        <div className="search-container">
          <h3>MRT Routes Finder</h3>
          {
            SEARCHBOX.map((type, index) => <SearchBox key={index} type={type} onInputChange={this.handleInputChange} />)
          }
          <button onClick={this.handleSubmit}>Find routes</button>
        </div>

        <div className="results-container">
          <h3>Suggested Routes</h3>
          <div id='results' />
        </div>
      </div>
    )
  }
}

export default RoutesFinder;