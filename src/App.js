import React, { Component } from 'react';
import {Provider} from "mobx-react"
// import AppContainer from "./config";
import stores from "./stores"
import Bluetooth from './components/smart/Bluetooth'

export default class App extends Component {
  render() {
    return (
      // mobx Provider {... va parcourir la liste des stores dans ./stores/index.js}
      <Provider {...stores}>
        <Bluetooth />
      </Provider>
    );
  }
}
