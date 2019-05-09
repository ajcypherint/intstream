import React from 'react';
import { Route,Switch } from 'react-router-dom'

import Login from './containers/Login';
import PrivateRoute from './containers/PrivateRoute';
import Contents from './components/Contents'


//todo(aj) put nested routes inside Detonate under the navigation
function App(props) {
  return (
    <Switch>
      <Route exact path="/login/" component={Login} />
      <PrivateRoute path="/" component={Contents} />
      
    </Switch>
    )
}


export default App
