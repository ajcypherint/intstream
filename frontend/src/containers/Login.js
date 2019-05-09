import React from 'react'
import { connect } from 'react-redux'
import { Redirect,Link } from 'react-router-dom'
import intstream from './IntStreamwhite.png'

import LoginForm from '../components/LoginForm'
import {login} from  '../actions/auth'
import {setUser} from  '../actions/auth'
import {authErrors, isAuthenticated,get_username} from '../reducers'

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
           <img src={intstream} width="300" hieght="200" alt="instream"/>
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
  isAuthenticated: isAuthenticated(state),
  username:get_username(state)
})

const mapDispatchToProps = (dispatch) => ({
  onUserChange:(username) =>{
    dispatch(setUser(username))
  },
  onSubmit: (username, password) => {
    dispatch(login(username, password))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Login);
