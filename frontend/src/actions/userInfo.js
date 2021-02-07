import { RSAA } from 'redux-api-middleware'
import { withAuth } from '../reducers/util'

export const USERINFO_REQUEST = '@@jwt/USERINFO_REQUEST'
export const USERINFO_SUCCESS = '@@jwt/USERINFO_SUCCESS'
export const USERINFO_FAILURE = '@@jwt/USERINFO_FAILURE'

export const LOGIN_REQUEST = '@@jwt/LOGIN_REQUEST'
export const LOGIN_SUCCESS = '@@jwt/LOGIN_SUCCESS'
export const LOGIN_FAILURE = '@@jwt/LOGIN_FAILURE'

export const login = (username, password) => ({
  [RSAA]: {
    endpoint: '/api/token-auth/',
    method: 'POST',
    fetch: fetch,
    body: JSON.stringify({ username, password }),
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
      fetch: fetch,
      body: '',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        USERINFO_REQUEST, USERINFO_SUCCESS, USERINFO_FAILURE
      ]
    }
  }
}
export const loginGroup = (username, password) => {
  return async (dispatch, getState) => {
    const resp = await dispatch(login(username, password))
    if (resp.error) {
      return
    }
    return await dispatch(userInfo())
    // todo get user group here and set redux state
  }
}
