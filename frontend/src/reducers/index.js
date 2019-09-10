import { combineReducers } from 'redux'
import auth, * as fromAuth from './auth.js'
import password, * as fromPassword from './password.js'
import categories, * as fromCategories from './categories.js'

export default combineReducers({
  auth: auth,
  password:password,
  categories:categories
})

//fromAuth
export const isAuthenticated = state => fromAuth.isAuthenticated(state.auth)
export const get_username = state => fromAuth.get_username(state.auth)
export const accessToken = state => fromAuth.accessToken(state.auth)
export const isAccessTokenExpired = state => fromAuth.isAccessTokenExpired(state.auth)
export const refreshToken = state => fromAuth.refreshToken(state.auth)
export const isRefreshTokenExpired = state => fromAuth.isRefreshTokenExpired(state.auth)
export const authErrors = state => fromAuth.errors(state.auth)

//fromCategories
export const catErrors = state => fromCategories.errors(state.categories)
export const getCategories= state => fromCategories.categories(state.categories)

//fromPassword
export const getPasswordChanged = state => fromPassword.getPasswordChanged(state.password)

export function withAuth(headers={}) {
  return (state) => ({
    ...headers,
    'Authorization': `Bearer ${accessToken(state)}`
  })
}
