import React from 'react';
import ReactDOM from 'react-dom';
import createHistory from 'history/createBrowserHistory'
import { BrowserRouter ,Route,Switch } from 'react-router-dom'
import { Provider } from 'react-redux'

import 'bootstrap/dist/css/bootstrap.css';
import './custom.css';
import configureStore from './store'
import App from './App'
import {PersistGate} from 'redux-persist/integration/react'

const history = createHistory()

const {store,persistor} = configureStore(history)

ReactDOM.render((
  <Provider store={store}>
    <PersistGate loading={null} persistor = {persistor}>
      <BrowserRouter basename="intstream">
        <App/>
      </BrowserRouter>
    </PersistGate>
  </Provider>
), document.getElementById('root'));
