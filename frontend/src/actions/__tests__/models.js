import * as actions from "../models.js"
import configureMockStore from 'redux-mock-store'
import fetchMock from 'fetch-mock'

import { apiMiddleware } from 'redux-api-middleware';
import thunk from 'redux-thunk'
const middlewares = [thunk, apiMiddleware]
const mockStore = configureMockStore(middlewares)

describe('models', () => {


  afterEach(() => {
    fetchMock.restore()
  })
  it('addModels', () => {
    let dispatch = jest.fn()
    dispatch.mockReturnValueOnce({})
    let goBack = jest.fn()
    return actions.addModels("test","test","method",goBack)(
     dispatch,()=>{}).then(() => {
      // return of async actions
      expect(dispatch).toHaveBeenCalled()
    })
  })
  it('getModels', () => {
    const store = mockStore({auth:{access:"xxx"}})
    let resp_payload = {test:true}
    let url = "/api/"
    fetchMock.get(url, {
      body: resp_payload,
      headers: { 'content-type': 'application/json' }
    })

    const expectedActions = [
      { type: actions.GET_MODELS_REQUEST},
      { type: actions.GET_MODELS_SUCCESS, payload: resp_payload }
    ]

    return store.dispatch(actions.getModels(url)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
  it('putModels', () => {
    const store = mockStore({auth:{access:"xxx"}})
    let data = {test:true}
    let resp_payload = {test:true}
    let url = "/api/"
    fetchMock.put(url, {
      body: resp_payload,
      headers: { 'content-type': 'application/json' }
    })

    const expectedActions = [
      { type: actions.SET_MODELS_REQUEST},
      { type: actions.SET_MODELS_SUCCESS, payload: resp_payload }
    ]

    return store.dispatch(actions.setModels(url, data)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })


})
