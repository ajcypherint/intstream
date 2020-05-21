import React from 'react';
import { Route,Switch } from 'react-router-dom'

import Login from './containers/Login';
import forgotPassword from "./components/forgotPassword"
import PrivateRoute from './containers/PrivateRoute';
import Contents from './containers/Contents'
export const FORGOT_LINK = "/forgot_password"


//todo(aj) put nested routes inside Detonate under the navigation
function App(props) {
  return (
    <Switch>
      <Route exact path="/login/" component={Login} />
      <Route exact path={FORGOT_LINK} component={forgotPassword} />
      <PrivateRoute path="/" component={Contents} />
      
    </Switch>
    )
}


export default App
