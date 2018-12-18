import React from 'react';
import './StationLabel.css';

const StationLabel = props => {
  return (
    <li className="train-container">
      <span className="train-icon"></span>
      <span className="capitalize station-name">{props.name}</span>
    </li>
  )
}

export default StationLabel;