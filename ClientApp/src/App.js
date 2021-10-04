import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { GlobalWeather } from './components/GlobalWeather';
import { Counter } from './components/Counter';
import Viz from './components/Viz';
import GlobeBuilder from './components/GlobeBuilder';
import * as THREE from "three";

import './custom.css'

export default class App extends Component {
    static displayName = App.name;


  render () {
      return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/counter' component={Counter} />
              <Route path='/global-weather' component={GlobalWeather} />
              <Route path='/globe-builder' component={GlobeBuilder} />
            <Route path='/Viz' component={Viz} />
       
          </Layout>
          
    );
  }
}
