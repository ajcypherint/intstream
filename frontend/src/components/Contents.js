import React, { Component } from 'react'
import { connect } from 'react-redux'

import Navigation from '../containers/Navigation'
import Main from './Main'

export class AppContainer extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div>
      <Navigation/>
      <Main/>
    </div>
    )
  }
}
