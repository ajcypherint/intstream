import React, { Component } from 'react';
import { connect } from 'react-redux'

import {logout} from '../actions/auth'
import {serverMessage} from '../reducers'
import { Redirect,Link } from 'react-router-dom'

class AppContainer extends Component {
  constructor(props){
    super(props)
  }
  render() {
    this.props.logout_m()
    return (
      <Redirect to="/"/>
    )
  }
}
const mapDispatchToProps = dispatch =>({
  logout_m: (payload) => dispatch(logout())
})
export default connect(null,mapDispatchToProps)(AppContainer);
