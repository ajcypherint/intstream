import React from 'react'
import ReactDOM from 'react-dom';
import { Route,Switch } from 'react-router-dom'
import Home from "../containers/Home"
import About from "./About"
import Logout from "./Logout"
import Password from "./Password"

const Main = (props)=>(
  <Switch>
    <Route exact path="/" component={Home}/>
    <Route exact path="/about" component={About}/>
    <Route exact path="/logout" component={Logout}/>
    <Route exact path="/password" component={Password}/>
  </Switch>
  
)

export default Main 

