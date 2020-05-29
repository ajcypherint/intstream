import configureMockStore from 'redux-mock-store'
import * as util from '../util'
import * as actions from "../sources"
import fetchMock from 'fetch-mock'

import { apiMiddleware } from 'redux-api-middleware';
import thunk from 'redux-thunk'
const middlewares = [thunk, apiMiddleware]
const mockStore = configureMockStore(middlewares)

describe('util', () => {
  afterEach(() => {
    fetchMock.restore()
  })
 it('getAll', () => {
    const store = mockStore({auth:{access:"xxx"}})
    fetchMock.getOnce('/api', {
      body: { results:{id: 1}, count:1},
      headers: { 'content-type': 'application/json' }
    })
    fetchMock.getOnce('/api?&page=1', {
      body: { results:{id: 1}, count:1},
      headers: { 'content-type': 'application/json' }
    })


    const expectedActions = [
      { type: actions.GET_SOURCES_REQUEST},
      { type: actions.GET_SOURCES_SUCCESS, payload: { results:{id:1},count: 1 } },
      { type: actions.GET_SOURCES_REQUEST},
      { type: actions.GET_SOURCES_SUCCESS, payload: { results:{id:1},count: 1 } },
 
      {
          type:actions.GET_TOTAL_SOURCES,
          payload:{sources:[{id:1}],totalCount:1}
        }

    ]
    const getAllArticles = util.getAll(actions.getSources)(actions.totalSources)
    return store.dispatch(getAllArticles("/api")).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions)
        })
  })


})
