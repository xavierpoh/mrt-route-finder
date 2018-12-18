import React, { Component } from 'react';
import findRoutes, { getAllStations } from '../../routing/findRoutes';
import './RoutesFinder.css';
import SuggestedRoute from '../SuggestedRoute/SuggestedRoute';
import StationSelectBox from '../StationSelectBox/StationSelectBox';

class RoutesFinder extends Component {

  constructor(props) {
    super(props);

    this.state = {
      start: '',
      end: '',
      suggestedRoutesList: null,
      stationsList: [],
      disableSearch: false,
    }
  }

  componentDidMount() {
    let stationsList = getAllStations();
    this.setState({ 
      start: stationsList[0],
      end: stationsList[1],
      stationsList
    });
  }

  handleChange = (event) => {
    // clear results from previous search
    if (this.state.suggestedRoutesList) {
      this.setState({ suggestedRoutesList: null });
    };

    this.setState({ [event.target.id]: event.target.value }, () => {
      // if start and end are same stations, disable search and show error message
      if (this.state.start === this.state.end) {
        this.setState({ disableSearch: true });
      } else {
        this.setState({ disableSearch: false });
      }
    });
    
  }

  handleSubmit = () => {
      let suggestedRoutesList = findRoutes(this.state.start, this.state.end);

      // uppercase 'lrt' substring if there is any 
      suggestedRoutesList.forEach(route => {
        let lineSubstringArray = route.line_name.split(' ');
        let lrtIndex = lineSubstringArray.indexOf('lrt');
        if (lrtIndex !== -1) {
          lineSubstringArray[lrtIndex] = lineSubstringArray[lrtIndex].toUpperCase();
          route.line_name = lineSubstringArray.join(' ');
        }
      });

      this.setState({ suggestedRoutesList });
  }

  render() {
    return (
      <div className="routes-finder">

        {/* Start of Search section */}
        <div className="search-container">
          <h3 className="main-header bold">MRT Journey Planner</h3>
          <div className="sub-header">Let's get you somewhere.</div>
          
          <StationSelectBox location="start" stationName={this.state.start} stationsList={this.state.stationsList} onInputChange={this.handleChange}/>
          <StationSelectBox location="end" stationName={this.state.end} stationsList={this.state.stationsList} onInputChange={this.handleChange}/>

          <div className="button-container">
            <button type="button" className="btn search-btn" onClick={this.handleSubmit} disabled={this.state.disableSearch}>Search</button>
            <div style={{ visibility: this.state.disableSearch ? 'visible' : 'hidden' }} className="error-message">
              Please select a different start or end point.
            </div>
          </div>
        </div>
        {/* End of Search section */}

        {/* Start of results section */}
        {
        this.state.suggestedRoutesList &&
        <div className="results-container">
          <h5 className="bold">Suggested Routes</h5>
            <div className="route-container accordion" id="accordionExample">
              <div className="brief-route-container card">
                <div className="card-header" id="headingOne">
                  <button className="btn collapsed brief-route-btn" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                    <ul className="line-code-ul">
                      {
                        this.state.suggestedRoutesList.map((route, index) => (
                          <li className={index < this.state.suggestedRoutesList.length - 1 ? 'add-arrow' : 'no-arrow'} key={index}>
                            <span className="line-code" style={{ background: route.colour }}>{route.line_code}</span>
                          </li>
                        ))
                      }
                    </ul>
                  </button>
                </div>

                <div id="collapseOne" className="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
                  <div className="card-body border-bottom">
                    {
                      this.state.suggestedRoutesList.map((route, index) => (
                        <SuggestedRoute key={index} route={route} />
                      ))
                    }
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        }
        {/* End of results section */}
      </div>
    )
  }
}

export default RoutesFinder;