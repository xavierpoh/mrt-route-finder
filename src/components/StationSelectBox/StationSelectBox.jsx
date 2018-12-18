import React, { Component } from 'react';
import './StationSelectBox.css';

class SearchBox extends Component {
  constructor(props) {
    super(props);
  }

  handleInputChange = (event) => {
    this.props.onInputChange(event);
  }

  render() {
    return (
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <label className="input-group-text capitalize label-width" htmlFor={this.props.location}>{this.props.location}</label>
        </div>
        <select className="custom-select capitalize" id={this.props.location} value={this.props.stationName} onChange={this.handleInputChange}>
          {
            this.props.stationsList &&
            this.props.stationsList.map((station, index) => (
              <option key={index} value={station}>{station.replace(/_/g, ' ')}</option>
            ))
          }
        </select>
      </div>
    )
  }
}

export default SearchBox;