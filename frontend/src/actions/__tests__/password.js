import * as actions from '../password.js'
import configureMockStore from 'redux-mock-store'
import fetchMock from 'fetch-mock'

import { apiMiddleware } from 'redux-api-middleware'
import thunk from 'redux-thunk'
const middlewares = [thunk, apiMiddleware]
const mockStore = configureMockStore(middlewares)

describe('password', () => {
  afterEach(() => {
    fetchMock.restore()
  })
  it('set password', () => {
    const store = mockStore({ auth: { access: 'xxx' } })
    const resp = { test: 1 }
    const user = 1
    const api = '/api/usersingle/' + user + '/set_password/'
    fetchMock.postOnce(api, {
      body: resp,
      headers: { 'content-type': 'application/json' }
    })

    const expectedActions = [
      { type: actions.PASSWORD_REQUEST },
      { type: actions.PASSWORD_SUCCESS, payload: resp }
    ]

    return store.dispatch(actions.setPassword(user, 'xxx')).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('getUser', () => {
    const store = mockStore({ auth: { access: 'xxx' } })
    const resp = { test: 1 }
    const endpoint = '/api/usersingle/'
    fetchMock.getOnce(endpoint, {
      body: resp,
      headers: { 'content-type': 'application/json' }
    })

    const expectedActions = [
      { type: actions.USER_REQUEST },
      { type: actions.USER_SUCCESS, payload: resp }
    ]

    return store.dispatch(actions.getUser()).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('setpassredirect', () => {
    jest.spyOn(actions, 'setPassword').mockReturnValue({})
    const dispatch = jest.fn()
    dispatch.mockReturnValueOnce({})
    const goBack = jest.fn()
    const push = jest.fn()
    const history = { push: push }
    return actions.setPassRedirect('user', 'password', history)(dispatch, () => {}).then(() => {
      // return of async actions
      expect(dispatch).toHaveBeenCalled()
      expect(push).toHaveBeenCalled()
    })
  })
})
