import React from 'react';
import StationLabel from '../StationLabel/StationLabel';
import './SuggestedRoute.css';

const SuggestedRoute = props => {
  return (
    <div className="line-container border-bottom">
      <div className="line-header">
        <span className="line-code" style={{ background: props.route.colour }}>{props.route.line_code}</span>
        <span className="line-name capitalize bold">{props.route.line_name}</span>
      </div>
      <div className="line-body">
        <ul className="line-ul">
          <StationLabel name={props.route.from} />
          <li className="stops-li">
            <span className="coloured-line" style={{ background: props.route.colour }}></span>
            <span className="stops">{props.route.stops > 1 ? `${props.route.stops} stops`: `${props.route.stops} stop`}</span>
          </li>
          <StationLabel name={props.route.to}/>
        </ul>
      </div>
    </div>
  )
}

export default SuggestedRoute;