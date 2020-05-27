import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../childArticles'
import fetchMock from 'fetch-mock'

import { apiMiddleware } from 'redux-api-middleware';
const middlewares = [thunk, apiMiddleware]
const mockStore = configureMockStore(middlewares)

describe('childARticles actions', () => {
  afterEach(() => {
    fetchMock.reset()
    fetchMock.restore()
  })
  it('clear parent', () => {
    let RET = {
      type:actions.CLEAR,
    }

    let resp = actions.clearParent()
    expect(resp).toEqual(RET)
  })
 
  it('set child', () => {
    let articles = [1, 2]
    let RET = {
    type:actions.SET_CHILDREN,
    payload:articles
  }

    let resp = actions.setChildren(articles)
    expect(resp).toEqual(RET)
  })
 
  it('get child articles', () => {
    const store = mockStore({auth:{access:"xxx"}})
    let url = "/api/child/"
    let parent_d = { id:1, title:"test", match:[]}

    fetchMock.getOnce(url, {
      body:{test:"test"},
      headers: { 'content-type': 'application/json' }
     })

    const expectedActions = [
      { type: actions.GET_ARTICLES_REQUEST, 
          meta:{
            parent:1,parent_match:[],parent_title:"test"}
 
      },
      { type: actions.GET_ARTICLES_SUCCESS, 
         meta:{parent:1,
                parent_match:[],
                parent_title:"test"},
            payload: { 
             test:"test"} 
          }
     ]

    return store.dispatch(actions.getChildArticles(parent_d, url)).then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions)
      })
  })

})
