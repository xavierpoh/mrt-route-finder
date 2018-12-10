import React, { Component } from 'react';
import './SearchBox.scss';

class SearchBox extends Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange() {
    this.props.onInputChange(this.props.type);
  }

  render() {
    return (
      <div className="searchbox">
        <input id={this.props.type} placeholder={this.props.type === 'origin' ? 'From' : 'To'} onChange={this.handleInputChange} />
      </div>
    )
  }
}

export default SearchBox;