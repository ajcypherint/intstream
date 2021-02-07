import { RSAA } from 'redux-api-middleware';
import { withAuth } from '../reducers/util'
import  URL  from  'url-parse'

let ENDPOINT = '/api/password-reset/'

export const PASSWORDRESET_REQUEST = '@@password-reset/PASSWORDRESET_REQUEST';
export const PASSWORDRESET_SUCCESS = '@@password-reset/PASSWORDRESET_SUCCESS';
export const PASSWORDRESET_FAILURE = '@@password-reset/PASSWORDRESET_FAILURE';

export const PASSWORDRESET_CLEAR= '@@password-reset/PASSWORDRESET_CLEAR';

export const clear = ()=>{
  return {
    type:PASSWORDRESET_CLEAR,
    payload:{}

  }
}
export const sendEmail = (email)=>{
  let data = {
    "email":email
              }
  return {
  [RSAA]:{
   endpoint: ENDPOINT,
    fetch:fetch,
      method: 'POST',
      body: JSON.stringify(data),
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        PASSWORDRESET_REQUEST, PASSWORDRESET_SUCCESS, PASSWORDRESET_FAILURE
      ]

  }

  }
}

export const sendEmailRedirect= (email, history) =>{
 return async (dispatch, getState)=>{
   let resp = await dispatch(sendEmail(email))
   if(resp.error){
     return
   }
   history.goBack()
   
 }
}
