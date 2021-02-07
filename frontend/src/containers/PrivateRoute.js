import React from 'react'
import { Route, Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import * as reducers from '../reducers'

const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => {
  return (
      <Route {...rest} render={props => (
        isAuthenticated
          ? (
          <Component {...props}>
          </Component>
            )
          : (
          <Redirect to={{
            pathname: '/login',
            state: { from: props.location }
          }}/>
            )
      )}/>
  )
}

const mapStateToProps = (state) => ({
  isAuthenticated: reducers.isAuthenticated(state)
})
export default connect(mapStateToProps, null)(PrivateRoute)
