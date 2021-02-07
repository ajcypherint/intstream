import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../auth'
import * as useractions from '../userInfo'
import fetchMock from 'fetch-mock'

import { apiMiddleware } from 'redux-api-middleware';
const middlewares = [thunk, apiMiddleware]
const mockStore = configureMockStore(middlewares)

describe('auth actions', () => {
  afterEach(() => {
    fetchMock.reset()
    fetchMock.restore()
  })
  it('logout', () => {
    let RET =  {
      type:actions.LOGOUT,
      payload:undefined
    }

    let resp = actions.logout()
    expect(resp).toEqual(RET)
  })
  it('setuser', () => {
    let username="test"
    let RET = {
      type:actions.SET_USER,
      payload:{username:username}
    }
    let resp = actions.setUser(username)
    expect(resp).toEqual(RET)
  })
  it('refresh', () => {
    const store = mockStore({auth:{access:"xxx"}})
    let token = "test"
    fetchMock.postOnce('/api/token-refresh/', {
      body: { refresh:token },
      headers: { 'content-type': 'application/json' }
     })

    const expectedActions = [
        { type: actions.TOKEN_REQUEST},
        { type: actions.TOKEN_RECEIVED, payload: {refresh:token } }
     ]

    return store.dispatch(actions.refreshAccessToken(token)).then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions)
      })
  })


  it('login', () => {
    const store = mockStore({})
    let name = "test"
    let password = "test"
    fetchMock.postOnce('/api/token-auth/', {
      body: { ok:"ok" },
      headers: { 'content-type': 'application/json' }
     })

    const expectedActions = [
        { type: actions.LOGIN_REQUEST},
        { type: actions.LOGIN_SUCCESS, payload: {ok:"ok" } }
     ]

    return store.dispatch(useractions.login(name, password)).then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions)
      })
  })

  it('userinfo', () => {
    const store = mockStore({auth:{access:"xxx"}})
    let name = "test"
    fetchMock.getOnce('/api/userinfo/', {
      body: { username:name },
      headers: { 'content-type': 'application/json' }
     })

    const expectedActions = [
        { type: actions.USERINFO_REQUEST},
        { type: actions.USERINFO_SUCCESS, payload: {username:name} }
     ]

    return store.dispatch(useractions.userInfo()).then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions)
      })
  })

  it('loginGroup', () => {
    const store = mockStore({auth:{access:"xxx"}})
    let name = "test"
    let password = "test"

    fetchMock.postOnce('/api/token-auth/', {
      body: { ok:"test" },
      headers: { 'content-type': 'application/json' }
     })
    fetchMock.getOnce('/api/userinfo/', {
      body: { username:name },
      headers: { 'content-type': 'application/json' }
     })


    const expectedActions = [
        { type: actions.LOGIN_REQUEST},
        { type: actions.LOGIN_SUCCESS, payload: {ok:"test" } },
        { type: actions.USERINFO_REQUEST},
        { type: actions.USERINFO_SUCCESS, payload: {username:name} }
     ]

    return store.dispatch(actions.loginGroup()).then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions)
      })
  })


})
