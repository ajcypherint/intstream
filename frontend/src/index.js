import React from 'react'
import ReactDOM from 'react-dom'
import createHistory from 'history/createBrowserHistory'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import { QueryParamProvider } from 'use-query-params'

import 'react-tabs/style/react-tabs.css'
import 'bootstrap/dist/css/bootstrap.css'
import './custom.css'
import configureStore from './store'
import App from './App'
import { PersistGate } from 'redux-persist/integration/react'
import { root } from './saga/polling'

const history = createHistory()

const { store, persistor, sagaMiddleware } = configureStore(history)

ReactDOM.render((
  <Provider store={store}>
    <PersistGate loading={null} persistor = {persistor}>
      <BrowserRouter basename="intstream">
        <QueryParamProvider ReactRouterRoute={Route}>
         <App/>
       </QueryParamProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
), document.getElementById('root'))

sagaMiddleware.run(root)
