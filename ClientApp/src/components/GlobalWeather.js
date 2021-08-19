import React, { Component, useRef } from 'react';
import Globe from 'react-globe.gl';
import './Globe.css';
import './styles.css';
import './CityInputForm.js';
import { CityForm } from './CityInputForm.js';
import { render } from 'react-dom';
import WeatherGlobe from './WeatherGlobe.js';


const divStyle = {
    color: 'blue',
    position: 'absolute',
    right: 0,
    left: 0,
    marginLeft: 0,
    marginRight: 0,
    paddingLeft: 0,
    paddingRight: 0
};


export class GlobalWeather extends Component {
    static displayName = GlobalWeather.name;

  constructor(props) {
    super(props);
      this.state = { forecasts: [], loading: true };

  }

    async componentWillMount() {
        const response = await fetch(`Forecasts`);
        try {
            const data = await response.json();
            this.handleForecastChange({ forecasts: data });
        }
        catch (err) {
            console.log("err", err);
        }
    }


    handleForecastChange = (forecastData) => {
        // if adding new data forecast data will be 1. Otherwise it is adding all previous forecasts for the date
        if (forecastData.forecasts.length == 1) {
            const forecastName = (element) => element.name == forecastData.forecasts[0].name;
            let foundID = this.state.forecasts.findIndex(forecastName);
            if (foundID != -1){
                this.state.forecasts[this.state.forecasts.findIndex(forecastName)] = forecastData.forecasts[0];
            } else {
                this.state.forecasts = this.state.forecasts.concat(forecastData.forecasts)
            }
        }
        else {
            this.state.forecasts = this.state.forecasts.concat(forecastData.forecasts)
        }
        this.setState({ forecasts: this.state.forecasts, loading: false });    

    }

    static renderForecastsTable(forecasts) {

        // tempAdjust: To adjust the temp so the bars on the graph are at least tempAdjust value sized when temp is 0
        const tempAdjust = 0.2;

        const gData = [...Array(forecasts.length).keys(forecasts)].map((x, index) => ({
            name: forecasts[index].name,
            tempC: forecasts[index].temperatureC,
            lat: forecasts[index].lat,
            lng: forecasts[index].long,
            size: Math.abs(forecasts[index].temperatureC) / 100 + tempAdjust,
            color: forecasts[index].temperatureC > 0 ? 'red' : 'blue' 
         
        }));

        // ['red', 'white', 'blue', 'green']
        //[Math.round(Math.random() * 3)]
        //globeEl.current.controls().enableZoom = false;
        //                        <Globe ref={globeEl} backgroundColor="#CBC3E3" globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg" pointsData = { gData } />
      return (
          <div class="container-sm" style={divStyle}>
              <div class="row">
                  <div class="col col-sm-3" >
                      <WeatherGlobe pointData={gData} />
                      </div>
              </div>
              <div class="row" >
                  <div class="col">
                  <table className='table table-striped' aria-labelledby="tabelLabel">
                    <thead>
                        <tr>
                            <th>City</th>
                            <th>Date</th>
                            <th>Update Time</th>
                            <th>Temp. (C)</th>
                            <th>Wind Speed (Meters/s)</th>
                            <th>Summary</th>
                      </tr>
                    </thead>
                          <tbody>
                              {forecasts.map(function(forecast) {
                                  let [date, time] = forecast.date.split("T");

                                  return (
                                      <tr key={forecast.date}>
                                          <td>{forecast.name}</td>
                                          <td>{date}</td>
                                          <td>{time.substring(0, 5)}</td>
                                          <td>{forecast.temperatureC}</td>
                                          <td>{forecast.wind}</td>
                                          <td>{forecast.summary}</td>
                                      </tr>
                                      )
                              }
                      )}
                    </tbody>
                          </table>
                  </div>
                  </div>
              </div>
    );
  }

    render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
        : GlobalWeather.renderForecastsTable(this.state.forecasts);

    return (
        <div>
            <div class="container">
                <div class="row">
                    <div class="col">
                        <h1 id="tabelLabel" >Globe!</h1>
                        <p>Turn the globe into kerplunk by typing in city names!</p>
                        <p>Scroll for table</p>
                    </div>
                    <CityForm onForecastChange={this.handleForecastChange} />

                    </div>
            </div>
        {contents}
      </div>
    );
    }

}
