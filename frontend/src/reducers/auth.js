import jwtDecode from 'jwt-decode'
import * as auth from '../actions/auth'
import * as userInfo from '../actions/userInfo'

export const initialState = {
  username: undefined,
  isStaff: false,
  isIntegrator: false,
  isSuperuser: false,
  access: undefined,
  refresh: undefined,
  errors: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case userInfo.USERINFO_SUCCESS:
    {
      return {
        ...state,
        isStaff: action.payload.results[0].is_staff,
        isIntegrator: action.payload.results[0].is_integrator,
        isSuperuser: action.payload.results[0].is_superuser,
        errors: {}
      }
    }
    case auth.SET_USER:
      return {
        ...state,
        username: action.payload.username
      }
    case auth.LOGOUT:
      return {
        ...initialState
      }
    case userInfo.LOGIN_SUCCESS:
      return {
        ...state,
        access: {
          token: action.payload.access,
          ...jwtDecode(action.payload.access)
        },
        refresh: {
          token: action.payload.refresh,
          ...jwtDecode(action.payload.refresh)
        },
        errors: {}
      }
    case auth.TOKEN_RECEIVED:
      return {
        ...state,
        access: {
          token: action.payload.access,
          ...jwtDecode(action.payload.access)
        }
      }
    case userInfo.USERINFO_FAILURE:
    case userInfo.LOGIN_FAILURE:
    case auth.TOKEN_FAILURE:
      return {
        ...state,
        access: undefined,
        refresh: undefined,
        errors: action.payload.response || { non_field_errors: action.payload.statusText }
      }
    default:
      return state
  }
}

export function accessToken (state) {
  if (state.access) {
    return state.access.token
  }
}

export function isAccessTokenExpired (state) {
  if (state.access && state.access.exp) {
    return 1000 * state.access.exp - (new Date()).getTime() < 5000 // are we within 5 seconds of expiration?
  }
  return true
}

export function refreshToken (state) {
  if (state.refresh) {
    return state.refresh.token
  }
}

export function isRefreshTokenExpired (state) {
  if (state.refresh && state.refresh.exp) {
    return 1000 * state.refresh.exp - (new Date()).getTime() < 5000 // are we within 5 seconds of expire
  }
  return true
}
export function get_username (state) {
  return state.username
}
export function isIntegrator (state) {
  return state.isIntegrator
}
export function isStaff (state) {
  return state.isStaff
}
export function isSuperuser (state) {
  return state.isSuperuser
}
export function isAuthenticated (state) {
  return !isRefreshTokenExpired(state)
}

export function errors (state) {
  return state.errors
}
