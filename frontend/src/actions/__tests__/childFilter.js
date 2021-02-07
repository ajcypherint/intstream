import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../childFilter'
import fetchMock from 'fetch-mock'

import { apiMiddleware } from 'redux-api-middleware'
const middlewares = [thunk, apiMiddleware]
const mockStore = configureMockStore(middlewares)

describe('child actions', () => {
  afterEach(() => {
    fetchMock.reset()
    fetchMock.restore()
  })
  it('set child page', () => {
    const data = { page: 1 }
    const RET = {
      type: actions.PAGE,
      payload: data
    }

    const resp = actions.setChildPage(data)
    expect(resp).toEqual(RET)
  })
  it('set child home selections', () => {
    const data = { page: 1 }
    const RET = {
      type: actions.HOME,
      payload: data
    }

    const resp = actions.setChildHomeSelections(data)
    expect(resp).toEqual(RET)
  })

  it('get child filter', () => {
    const store = mockStore({ auth: { access: 'xxx' } })
    const url = '/api/filter/'
    fetchMock.getOnce(url, {
      body: { page: 1 },
      headers: { 'content-type': 'application/json' }
    })

    const expectedActions = [
      { type: actions.GET_FILTER_REQUEST },
      { type: actions.GET_FILTER_SUCCESS, payload: { page: 1 } }
    ]

    return store.dispatch(actions.getChildFilter(url)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})
