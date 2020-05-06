import React from 'react'
import { connect } from 'react-redux'
import * as reducers from '../reducers/'
import  forgotPassword from '../components/forgotPassword'
import { sendEmail } from '../actions/forgotPassword'
const mapStateToProps = (state) => ({
 

})

const mapDispatchToProps = (dispatch) => ({
   onSubmit: (username, history) => {
    dispatch(sendEmail(username, history))
  },
  
})

export default connect(mapStateToProps, mapDispatchToProps)(forgotPassword);
