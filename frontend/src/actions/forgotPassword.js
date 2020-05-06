import { RSAA } from 'redux-api-middleware';
import { withAuth } from '../reducers'
import  URL  from  'url-parse'

let ENDPOINT = '/api/password-reset/'

export const PASSWORDRESET_REQUEST = '@@password-reset/PASSWORDRESET_REQUEST';
export const PASSWORDRESET_SUCCESS = '@@password-reset/PASSWORDRESET_SUCCESS';
export const PASSWORDRESET_FAILURE = '@@password-reset/PASSWORDRESET_FAILURE';


export const sendEmail = (email, history)=>{
  let data = {
    "email":email
              }
  return {
  [RSAA]:{
   endpoint: ENDPOINT,
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
   
 }
}
