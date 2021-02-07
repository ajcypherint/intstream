import { isRSAA, apiMiddleware } from 'redux-api-middleware'
import { logout, TOKEN_RECEIVED, TOKEN_REQUEST, TOKEN_FAILURE, refreshAccessToken } from './actions/auth'

import { refreshToken, isAccessTokenExpired } from './reducers'

// todo - if i refresh the page then refresh token is called 2 times.  no clue why spent too many hours on it
// at this point this is still a mystery
// thunk needs to be first in middlware store chain in apply middleware
export function createApiMiddleware () {
  let postponedRSAAs = []

  return ({ dispatch, getState }) => { // store
    // store the middlware function with the state already passed
    const rsaaMiddleware = apiMiddleware({ dispatch, getState })

    return (next) => (action) => { // next ; action
      // injected middlware
      const nextCheckPostoned = (nextAction) => {
        // avoid processing thunks;
        // Run postponed actions after token refresh
        if (nextAction.type === TOKEN_RECEIVED) {
          // don't pass this down the line
          dispatch(nextAction)
          postponedRSAAs.forEach((postponed) => {
            return rsaaMiddleware(next)(postponed)
          })
          postponedRSAAs = []
        } else {
          if (nextAction.type === TOKEN_REQUEST) {
            // don't pass this down the line
            dispatch(nextAction)
          }
          if (nextAction.type === TOKEN_FAILURE) {
            // something went wrong
            dispatch(logout)
          }
        }
      }

      if (isRSAA(action)) {
        const state = getState()
        const token = refreshToken(state)

        if (token && isAccessTokenExpired(state)) { // if expired AND already not refreshing
          postponedRSAAs.push(action)
          // call the middleware
          return rsaaMiddleware(nextCheckPostoned)(refreshAccessToken(token))
        }

        return rsaaMiddleware(next)(action)
      }
      return next(action)
    }
  }
}

export default createApiMiddleware()
