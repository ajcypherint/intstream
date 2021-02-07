import React from 'react'
import { connect } from 'react-redux'
import { Redirect,Link } from 'react-router-dom'
import intstream from './IntStreamwhite.png'

import LoginForm from '../components/LoginForm'
import {login, loginGroup} from  '../actions/userInfo'
import {setUser} from  '../actions/auth'
import {authErrors, getRegMessage,isAuthenticated,get_username} from '../reducers'
import { clear } from '../actions/forgotPassword'

const Login = (props) => {
  if(props.isAuthenticated) {
     return  <Redirect to='/' />
  }

  return (
     <div className="container" >
       <div className="row" >
         <div className="col-sm-4 " >
         </div>
         <div className="col-sm-4" align="center">
           <img src={intstream} className="img-fluid" width="300" hieght="200" alt="instream"/>
          <LoginForm {...props}/>
        </div>
         <div className="col-sm-4">
         </div>
 
     </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  errors: authErrors(state),
  isAuthenticated:isAuthenticated(state),
  username:get_username(state),
  message:getRegMessage(state)
})

const mapDispatchToProps = (dispatch) => ({
  onUserChange:(username) =>{
    dispatch(setUser(username))
  },
  onSubmit: (username, password) => {
    dispatch(loginGroup(username, password));
    dispatch(clear())
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Login);
