import * as actions from '../trainFilter.js'
import configureMockStore from 'redux-mock-store'
import fetchMock from 'fetch-mock'

import { apiMiddleware } from 'redux-api-middleware'
import thunk from 'redux-thunk'
const middlewares = [thunk, apiMiddleware]
const mockStore = configureMockStore(middlewares)

describe('trainFilter', () => {
  afterEach(() => {
    fetchMock.restore()
  })
  it('gettrainfilter', () => {
    const store = mockStore({ auth: { access: 'xxx' } })
    const resp = { test: 1 }
    const id = 1
    const endpoint = '/api/'
    fetchMock.getOnce(endpoint, {
      body: resp,
      headers: { 'content-type': 'application/json' }
    })

    const expectedActions = [
      { type: actions.GET_FILTER_REQUEST },
      { type: actions.GET_FILTER_SUCCESS, payload: resp }
    ]

    return store.dispatch(actions.getfilter(endpoint)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('filterChange', () => {
    jest.spyOn(actions, 'getfilter').mockReturnValue({})
    jest.spyOn(actions, 'getAllSources').mockReturnValue({})
    const dispatch = jest.fn()
    dispatch.mockReturnValueOnce({})
    const startDate = new Date()
    const endDate = new Date()
    const setQuery = jest.fn()
    return actions.filterChange({ startDate: startDate, endDate: endDate },
      setQuery)(dispatch, () => {}).then(() => {
      // return of async actions
      expect(dispatch).toHaveBeenCalled()
      expect(setQuery).toHaveBeenCalled()
    })
  })
})
