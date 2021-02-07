import { RSAA } from 'redux-api-middleware'

export const TOKEN_REQUEST = '@@jwt/TOKEN_REQUEST'
export const TOKEN_RECEIVED = '@@jwt/TOKEN_RECEIVED'
export const TOKEN_FAILURE = '@@jwt/TOKEN_FAILURE'

export const LOGOUT = 'LOGOUT'
export const SET_USER = 'SET_USER'

export const refreshAccessToken = (token) => ({
  [RSAA]: {
    endpoint: '/api/token-refresh/',
    method: 'POST',
    body: JSON.stringify({ refresh: token }),
    headers: { 'Content-Type': 'application/json' },
    fetch: fetch,
    types: [
      TOKEN_REQUEST, TOKEN_RECEIVED, TOKEN_FAILURE
    ]
  }
})

export const setUser = (username) => (
  {
    type: SET_USER,
    payload: { username: username }
  }
)
export const logout = () => (
  {
    type: LOGOUT,
    payload: undefined
  }

)
