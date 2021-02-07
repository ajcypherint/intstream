import configureMockStore from 'redux-mock-store'
import * as actions from '../articles'
import fetchMock from 'fetch-mock'

import { apiMiddleware } from 'redux-api-middleware'
import thunk from 'redux-thunk'
const middlewares = [thunk, apiMiddleware]
const mockStore = configureMockStore(middlewares)

describe('articles actions', () => {
  afterEach(() => {
    fetchMock.restore()
  })
  it('clearArticles', () => {
    const DATA = 'TEST'
    const RET = {
      type: actions.CLEAR,
      payload: DATA
    }

    const resp = actions.clearArticles(DATA)
    expect(resp).toEqual(RET)
  })

  it('getarticles', () => {
    const store = mockStore({ auth: { access: 'xxx' } })
    fetchMock.get('/api', {
      body: { articles: 1 },
      headers: { 'content-type': 'application/json' }
    })

    const expectedActions = [
      { type: actions.GET_ARTICLES_REQUEST },
      { type: actions.GET_ARTICLES_SUCCESS, payload: { articles: 1 } }
    ]

    return store.dispatch(actions.getArticles('/api')).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('setarticles', () => {
    const store = mockStore({ auth: { access: 'xxx' } })
    fetchMock.putOnce('/api', {
      body: { articles: [1] },
      headers: { 'content-type': 'application/json' }
    })

    const expectedActions = [
      { type: actions.SET_ARTICLES_REQUEST },
      { type: actions.SET_ARTICLES_SUCCESS, payload: { articles: [1] } }
    ]

    return store.dispatch(actions.setArticles('/api', {})).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})
