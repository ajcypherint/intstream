import * as actions from '../randomArticle.js'
import configureMockStore from 'redux-mock-store'
import fetchMock from 'fetch-mock'

import { apiMiddleware } from 'redux-api-middleware'
import thunk from 'redux-thunk'
const middlewares = [thunk, apiMiddleware]
const mockStore = configureMockStore(middlewares)

describe('random article', () => {
  afterEach(() => {
    fetchMock.restore()
  })
  it('getarticle', () => {
    const store = mockStore({ auth: { access: 'xxx' } })
    const resp = { test: 1 }
    const model = 1
    const endpoint = '/api/unclass/?model=' + model
    fetchMock.getOnce(endpoint, {
      body: resp,
      headers: { 'content-type': 'application/json' }
    })

    const expectedActions = [
      { type: actions.GET_ARTICLE_REQUEST },
      { type: actions.GET_ARTICLE_SUCCESS, payload: resp }
    ]

    return store.dispatch(actions.getArticle(model)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('setClassification', () => {
    const store = mockStore({ auth: { access: 'xxx' } })
    const resp = { test: 1 }
    const model = 1
    const endpoint = '/api/unclass/' + model
    fetchMock.postOnce(endpoint, {
      body: resp,
      headers: { 'content-type': 'application/json' }
    })

    const expectedActions = [
      { type: actions.SET_ARTICLE_REQUEST },
      { type: actions.SET_ARTICLE_SUCCESS, payload: resp }
    ]

    return store.dispatch(actions.setClassification(model)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('classify next', () => {
    jest.spyOn(actions, 'setClassification').mockReturnValue({})
    const dispatch = jest.fn()
    const model = 1
    const article = 1
    const target = 1
    dispatch.mockReturnValueOnce({}).mockReturnValueOnce({})
    return actions.classifyNext(model, article, target)(dispatch, () => {}).then(() => {
      // return of async actions
      expect(dispatch).toHaveBeenCalled()
    })
  })
})
