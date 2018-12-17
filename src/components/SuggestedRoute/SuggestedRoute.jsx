import React, { Component } from 'react';
import './SuggestedRoute.scss';

class SuggestedRoute extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>{this.props.route.from}</div>
    )
  }
}

export default SuggestedRoute;