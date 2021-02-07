import { RSAA } from 'redux-api-middleware';
import { withAuth } from '../reducers/util'
import {setOrgs, ORGAPI} from './organizations'

export const POST_REGISTER_REQUEST = '@@registration/REGISTER_REQUEST';
export const POST_REGISTER_SUCCESS = '@@registration/REGISTER_SUCCESS';
export const POST_REGISTER_FAILURE = '@@registration/REGISTER_FAILURE';

const REGISTER_URL = "/api/register/"


export const register = (org,
                         username, 
                         first_name,
                         last_name,
                         password, 
                         password2, 
                         email)=>{
                                
  let data = {
        username:username,
        first_name:first_name,
        last_name:last_name,
        password:password,
        password2:password2,
        organization_name:org,
        email:email
      }
  return {
    [RSAA]:{
      endpoint: REGISTER_URL,
      method: 'POST',
      fetch:fetch,
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
      types: [
         POST_REGISTER_REQUEST, POST_REGISTER_SUCCESS, POST_REGISTER_FAILURE
        ]

  }
}
}

export const registerWOrg= (orgName, 
                         username,
                         first_name,
                         last_name,
                         password,
                         password2,
                         email,
                         history) =>{
 
  return async(dispatch,getState)=>{
    let respReg =  await dispatch(register(
                                   orgName,
                                   username,
                                   first_name,
                                   last_name,
                                   password,
                                   password2,
                                   email))
    if(respReg.error){
       return
    }
    history.goBack()
  }

}

