import * as actions from '../forgotPassword.js'
import configureMockStore from 'redux-mock-store'
import fetchMock from 'fetch-mock'

import { apiMiddleware } from 'redux-api-middleware'
import thunk from 'redux-thunk'
const middlewares = [thunk, apiMiddleware]
const mockStore = configureMockStore(middlewares)

describe('forgotPassword', () => {
  const dispatch = jest.fn()
  dispatch.mockReturnValueOnce({})

  afterEach(() => {
    fetchMock.restore()
  })
  it('sendEmailRedirect', () => {
    const store = mockStore({ auth: { access: 'xxx' } })
    return actions.sendEmailRedirect('test', 'test')(dispatch, () => {}).then(() => {
      // return of async actions
      expect(dispatch).toHaveBeenCalled()
    })
  })
  it('sendemail', () => {
    const store = mockStore({ auth: { access: 'xxx' } })
    const resp_payload = { test: true }
    fetchMock.post(actions.ENDPOINT, {
      body: resp_payload,
      headers: { 'content-type': 'application/json' }
    })

    const expectedActions = [
      { type: actions.PASSWORDRESET_REQUEST },
      { type: actions.PASSWORDRESET_SUCCESS, payload: resp_payload }
    ]

    return store.dispatch(actions.sendEmail('email')).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})
