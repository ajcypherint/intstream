import React, { Component } from 'react';
import { connect } from 'react-redux'

import {serverMessage} from '../reducers'
import Navigation from '../containers/Navigation'
import Main from './Main'

class AppContainer extends Component {
  constructor(props){
    super(props)
  }

  render() {
    return (
      <div>
      <Navigation/>
      <Main/>
    </div>
    );
  }
}

export default connect(
  null,
 null 
)(AppContainer);
