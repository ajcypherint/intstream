import * as actions from "../password.js"
import configureMockStore from 'redux-mock-store'
import fetchMock from 'fetch-mock'

import { apiMiddleware } from 'redux-api-middleware';
import thunk from 'redux-thunk'
const middlewares = [thunk, apiMiddleware]
const mockStore = configureMockStore(middlewares)

describe('password', () => {


  afterEach(() => {
    fetchMock.restore()
  })
  it('set password', () => {
    const store = mockStore({auth:{access:"xxx"}})
    let resp = {test:1}
    let user = 1
    let api = '/api/usersingle/'+user+'/set_password/'
    fetchMock.postOnce(api, {
      body: resp,
      headers: { 'content-type': 'application/json' }
     })

    const expectedActions = [
        { type: actions.PASSWORD_REQUEST},
        { type: actions.PASSWORD_SUCCESS, payload: resp }
     ]

    return store.dispatch(actions.set_password(user,"xxx")).then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions)
      })
  })


  it('get_user', () => {
    const store = mockStore({auth:{access:"xxx"}})
    let resp = {test:1}
    let endpoint = '/api/usersingle/'
    fetchMock.getOnce(endpoint, {
      body: resp,
      headers: { 'content-type': 'application/json' }
     })

    const expectedActions = [
        { type: actions.USER_REQUEST},
        { type: actions.USER_SUCCESS, payload: resp }
     ]

    return store.dispatch(actions.get_user()).then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions)
      })
  })



  it('setpassredirect', () => {
    jest.spyOn(actions, 'set_password').mockReturnValue({})
    const dispatch = jest.fn()
    dispatch.mockReturnValueOnce({})
    const goBack = jest.fn()
    let push = jest.fn()
    let history = {push:push}
    return actions.setPassRedirect("user","password",history)(dispatch,()=>{}).then(() => {
      // return of async actions
      expect(dispatch).toHaveBeenCalled()
      expect(push).toHaveBeenCalled()
    })
  })


})
