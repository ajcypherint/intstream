import * as actions from '../settings.js'
import configureMockStore from 'redux-mock-store'
import fetchMock from 'fetch-mock'

import { apiMiddleware } from 'redux-api-middleware'
import thunk from 'redux-thunk'
const middlewares = [thunk, apiMiddleware]
const mockStore = configureMockStore(middlewares)

describe('settings', () => {
  afterEach(() => {
    fetchMock.restore()
  })
  it('getsettings', () => {
    const store = mockStore({ auth: { access: 'xxx' } })
    const resp = { test: 1 }
    const id = 1
    const endpoint = '/api/'
    fetchMock.getOnce(endpoint, {
      body: resp,
      headers: { 'content-type': 'application/json' }
    })

    const expectedActions = [
      { type: actions.GET_SETTINGS_REQUEST },
      { type: actions.GET_SETTINGS_SUCCESS, payload: resp }
    ]

    return store.dispatch(actions.getSettings(endpoint)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('setsettings', () => {
    const store = mockStore({ auth: { access: 'xxx' } })
    const resp = { test: 1 }
    const id = 1
    const endpoint = '/api/'
    const data = { test: 1 }
    fetchMock.postOnce(endpoint, {
      body: resp,
      headers: { 'content-type': 'application/json' }
    })

    const expectedActions = [
      { type: actions.SET_SETTINGS_REQUEST },
      { type: actions.SET_SETTINGS_SUCCESS, payload: resp }
    ]

    return store.dispatch(actions.setSettings('/api/', data)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('getAllOrgs', () => {
    jest.spyOn(actions, 'setSettings').mockReturnValue({})
    jest.spyOn(actions, 'total').mockReturnValue({})
    const dispatch = jest.fn()
    dispatch.mockReturnValueOnce({ payload: { count: 1 } }).mockReturnValueOnce({ payload: { results: [1] } })
    return actions.getAllSettings()(dispatch, () => {}).then(() => {
      // return of async actions
      expect(dispatch).toHaveBeenCalled()
    })
  })
})
