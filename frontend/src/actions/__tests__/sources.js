import * as actions from "../sources.js"
import configureMockStore from 'redux-mock-store'
import fetchMock from 'fetch-mock'

import { apiMiddleware } from 'redux-api-middleware';
import thunk from 'redux-thunk'
const middlewares = [thunk, apiMiddleware]
const mockStore = configureMockStore(middlewares)

describe('sources', () => {


  afterEach(() => {
    fetchMock.restore()
  })
  it('getsources', () => {
    const store = mockStore({auth:{access:"xxx"}})
    let resp = {test:1}
    let id = 1
    let endpoint = "/api/" 
    fetchMock.getOnce(endpoint, {
      body: resp,
      headers: { 'content-type': 'application/json' }
     })

    const expectedActions = [
        { type: actions.GET_SOURCES_REQUEST},
        { type: actions.GET_SOURCES_SUCCESS, payload: resp }
     ]

    return store.dispatch(actions.getSources(endpoint)).then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions)
      })
  })


  it('setsources', () => {
    const store = mockStore({auth:{access:"xxx"}})
    let resp = {test:1}
    let id = 1
    let endpoint = "/api/" 
    let data = {"test":1}
    fetchMock.putOnce(endpoint, {
      body: resp,
      headers: { 'content-type': 'application/json' }
     })

    const expectedActions = [
        { type: actions.SET_SOURCES_REQUEST},
        { type: actions.SET_SOURCES_SUCCESS, payload: resp }
     ]

    return store.dispatch(actions.setSources("/api/",data)).then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions)
      })
  })


  it('getAllsources', () => {
    jest.spyOn(actions, 'setSources').mockReturnValue({})
    jest.spyOn(actions, 'totalSources').mockReturnValue({})
    const dispatch = jest.fn()
    dispatch.mockReturnValueOnce({payload:{count:1}}).mockReturnValueOnce({payload:{results:[1]}})
    return actions.getAllSources()(dispatch,()=>{}).then(() => {
      // return of async actions
      expect(dispatch).toHaveBeenCalled()
    })
  })

  it('addSources', () => {
    jest.spyOn(actions, 'setSources').mockReturnValue({})
    const dispatch = jest.fn()
    dispatch.mockReturnValueOnce({})
    const goBack = jest.fn()
    return actions.addSources("url","data","method", goBack)(dispatch,()=>{}).then(() => {
      // return of async actions
      expect(dispatch).toHaveBeenCalled()
      expect(goBack).toHaveBeenCalled()
    })
  })



})
