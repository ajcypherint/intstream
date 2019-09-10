import { RSAA } from 'redux-api-middleware';
import { withAuth } from '../reducers'

export const PASSWORD_REQUEST = '@@password/PASSWORD_REQUEST';
export const PASSWORD_SUCCESS = '@@password/PASSWORD_SUCCESS';
export const PASSWORD_FAILURE = '@@password/PASSWORD_FAILURE';

export const USER_REQUEST = '@@user/USER_REQUEST';
export const USER_SUCCESS = '@@user/USER_SUCCESS';
export const USER_FAILURE = '@@user/USER_FAILURE';

export const PASSWORD_CHANGED = "PASSWORD_CHANGED"

export const set_password = (user,password) => ({
  [RSAA]: {
    endpoint: '/api/users/'+user+'/set_password/',
      method: 'POST',
      body: JSON.stringify({username:user,password: password}),
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        PASSWORD_REQUEST, PASSWORD_SUCCESS, PASSWORD_FAILURE
      ]
  }
})

export const get_user = () =>({
  [RSAA]:{
   endpoint: '/api/users/',
      method: 'GET',
      body: '',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
       USER_REQUEST, USER_SUCCESS, USER_FAILURE
      ]

  }
})

export const setPasswordChanged = (bool) =>({
  type:PASSWORD_CHANGED,
  bool
 }
)
