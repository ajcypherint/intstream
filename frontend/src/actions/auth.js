import { RSAA } from 'redux-api-middleware';

export const LOGIN_REQUEST = '@@jwt/LOGIN_REQUEST';
export const LOGIN_SUCCESS = '@@jwt/LOGIN_SUCCESS';
export const LOGIN_FAILURE = '@@jwt/LOGIN_FAILURE';

export const USERINFO_REQUEST = '@@jwt/USERINFO_REQUEST';
export const USERINFO_SUCCESS = '@@jwt/USERINFO_SUCCESS';
export const USERINFO_FAILURE = '@@jwt/USERINFO_FAILURE';

export const TOKEN_REQUEST = '@@jwt/TOKEN_REQUEST';
export const TOKEN_RECEIVED = '@@jwt/TOKEN_RECEIVED';
export const TOKEN_FAILURE = '@@jwt/TOKEN_FAILURE';

export const LOGOUT = "LOGOUT"
export const SET_USER= "SET_USER"

export const login = (username, password) => ({
    [RSAA]: {
        endpoint: '/api/token-auth/',
        method: 'POST',
        body: JSON.stringify({username, password}),
        headers: { 'Content-Type': 'application/json' },
        types: [
            LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE
        ]
      }
})
export const userInfo = () => {
  return {
  [RSAA]: {
        endpoint: '/api/userinfo/',
        method: 'GET',
        body:'',
        headers: { 'Content-Type': 'application/json' },
        types: [
            USERINFO_REQUEST, USERINFO_SUCCESS, USERINFO_FAILURE
        ]
      }
  }
}
export const loginGroup = (username, password) => {
  return async (dispatch, getState)=>{
    let resp = await dispatch(login(username, password))
    if(resp.error){
      return
    }
    return await dispatch(userInfo())
    //todo get user group here and set redux state
  }
}
export const refreshAccessToken = (token) => ({
    [RSAA]: {
        endpoint: '/api/token-refresh/',
        method: 'POST',
        body: JSON.stringify({refresh: token}),
        headers: { 'Content-Type': 'application/json' },
        types: [
          TOKEN_REQUEST, TOKEN_RECEIVED, TOKEN_FAILURE
        ]
    }
})

export const setUser = (username) =>(
  {
    type:SET_USER,
    payload:{username:username}
  }
)
export const logout = () => (
  {
    type:LOGOUT,
    payload:undefined
  }

)
