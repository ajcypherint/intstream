import { isRSAA, apiMiddleware } from 'redux-api-middleware';

import { TOKEN_RECEIVED, refreshAccessToken } from './actions/auth'
import { refreshToken, isAccessTokenExpired } from './reducers'

//no fucking clue; this works
export function createApiMiddleware() {//capture rsaa middlware calls

  return ({ dispatch, getState }) => { //store param
    const rsaaMiddleware = apiMiddleware({dispatch, getState})
    let postponedRSAAs = [] //will only ever have one

    return (next) => (action) => { //next // action params
      // inner middlware
      const nextCheckPostoned = (nextAction) => {
          // Run postponed actions after token refresh
          if (nextAction.type === TOKEN_RECEIVED) {
            next(nextAction); //dispatch token_recieved do not return 
           
            let postponed = Object.assign(postponedRSAAs[0],{})
            postponedRSAAs.shift()
            return rsaaMiddleware(next)(postponed) // not sure why but I have to return this  if I use await anywhere;  propbably because promise or shit. who knows.
          } else {
            return next(nextAction) //token_request
          }
      }

      if(isRSAA(action)) {
        const state = getState(),
              token = refreshToken(state)

        if(token && isAccessTokenExpired(state)) {
            postponedRSAAs.push(action)
            return  rsaaMiddleware(nextCheckPostoned)(refreshAccessToken(token)) //create middlware from above as next and return it 
        }

        return rsaaMiddleware(next)(action); //token is undefined inject rsaa middlware pass next in line; must be a login
      }
      return next(action); //not RSAA  //chain the next middlware
    }
  }
}

export default createApiMiddleware();
