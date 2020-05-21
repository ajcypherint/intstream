import React, { Component } from 'react';

import {serverMessage} from '../reducers'
import { Redirect,Link } from 'react-router-dom'

export class AppContainer extends Component {
  constructor(props){
    super(props)
  }
  componentDidMount(){
   this.props.logout_m()
  }
  render() {
    return (
      <Redirect to="/"/>
    )
  }
}

