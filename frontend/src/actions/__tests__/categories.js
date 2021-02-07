import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../categories'
import fetchMock from 'fetch-mock'

import { apiMiddleware } from 'redux-api-middleware'
const middlewares = [thunk, apiMiddleware]
const mockStore = configureMockStore(middlewares)

describe('category actions', () => {
  afterEach(() => {
    fetchMock.reset()
    fetchMock.restore()
  })

  it('add categories', () => {
    const store = mockStore({ auth: { access: 'xxx' } })
    const category = 'test'
    fetchMock.postOnce('/api/categories/', {
      body: { ok: 'test' },
      headers: { 'content-type': 'application/json' }
    })

    const expectedActions = [
      { type: actions.ADD_CATEGORIES_REQUEST },
      { type: actions.ADD_CATEGORIES_SUCCESS, payload: { ok: 'test' } }
    ]

    return store.dispatch(actions.add_category(category)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('get categories', () => {
    const store = mockStore({ auth: { access: 'xxx' } })
    const category = 'test'
    fetchMock.getOnce('/api/categories/', {
      body: { categories: [] },
      headers: { 'content-type': 'application/json' }
    })

    const expectedActions = [
      { type: actions.CATEGORIES_REQUEST },
      { type: actions.CATEGORIES_SUCCESS, payload: { categories: [] } }
    ]

    return store.dispatch(actions.get_categories(category)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})
