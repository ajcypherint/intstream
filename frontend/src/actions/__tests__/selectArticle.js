import * as actions from '../selectArticle.js'
import configureMockStore from 'redux-mock-store'
import fetchMock from 'fetch-mock'

import { apiMiddleware } from 'redux-api-middleware'
import thunk from 'redux-thunk'
const middlewares = [thunk, apiMiddleware]
const mockStore = configureMockStore(middlewares)

describe('selectArticle', () => {
  afterEach(() => {
    fetchMock.restore()
  })
  it('getArticle', () => {
    const store = mockStore({ auth: { access: 'xxx' } })
    const url = '/api/'
    const id = 1
    const endpoint = url + '?id=' + id
    const resp = { test: 1 }
    fetchMock.getOnce(endpoint, {
      body: resp,
      headers: { 'content-type': 'application/json' }
    })

    const expectedActions = [
      { type: actions.GET_ARTICLES_REQUEST, meta: { id: id } },
      { type: actions.GET_ARTICLES_SUCCESS, meta: { id: id }, payload: resp }
    ]

    return store.dispatch(actions.getArticle(url, id)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})
