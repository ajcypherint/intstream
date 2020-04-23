import React from 'react'
import { connect } from 'react-redux'
import * as reducers from '../reducers/'
import Main from '../components/Navigation'

const mapStateToProps = (state) => ({
  isStaff:reducers.isStaff(state),
  isIntegrator:reducers.isIntegrator(state),
  isSuperuser:reducers.isSuperuser(state)
})


const mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(Main);
