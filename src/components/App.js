import React, { Component } from 'react';
import './App.css';
import RoutesFinder from './RoutesFinder/RoutesFinder';

class App extends Component {
    render() {
        return (
            <div className='app'>
              <RoutesFinder />
            </div>
        )
    }
}

export default App;
