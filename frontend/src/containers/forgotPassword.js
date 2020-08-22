import React from 'react'
import { connect } from 'react-redux'
import * as reducers from '../reducers/'
import  forgotPassword from '../components/forgotPassword'
import { sendEmailRedirect,clear } from '../actions/forgotPassword'
const mapStateToProps = (state) => ({
  errors:reducers.getFPassErrors(state),
  message:reducers.getFPMessage(state)
})

const mapDispatchToProps = (dispatch) => ({
   onSubmit: (username, history) => {
    dispatch(sendEmailRedirect(username, history))
  },
   clear: ()=>dispatch(clear())
})



export default connect(mapStateToProps, mapDispatchToProps)(forgotPassword);
