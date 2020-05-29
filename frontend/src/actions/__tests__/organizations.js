import * as actions from "../organizations.js"
import configureMockStore from 'redux-mock-store'
import fetchMock from 'fetch-mock'

import { apiMiddleware } from 'redux-api-middleware';
import thunk from 'redux-thunk'
const middlewares = [thunk, apiMiddleware]
const mockStore = configureMockStore(middlewares)

describe('organizations', () => {


  afterEach(() => {
    fetchMock.restore()
  })
  it('getOrgs', () => {
    const store = mockStore({auth:{access:"xxx"}})
    let resp = {test:1}
    let id = 1
    let endpoint = "/api/" 
    fetchMock.getOnce(endpoint, {
      body: resp,
      headers: { 'content-type': 'application/json' }
     })

    const expectedActions = [
        { type: actions.GET_ORGANIZATIONS_REQUEST},
        { type: actions.GET_ORGANIZATIONS_SUCCESS, payload: resp }
     ]

    return store.dispatch(actions.getOrgs("/api/")).then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions)
      })
  })


  it('setOrgs', () => {
    const store = mockStore({auth:{access:"xxx"}})
    let resp = {test:1}
    let id = 1
    let endpoint = "/api/" 
    fetchMock.putOnce(endpoint, {
      body: resp,
      headers: { 'content-type': 'application/json' }
     })

    const expectedActions = [
        { type: actions.SET_ORGANIZATIONS_REQUEST},
        { type: actions.SET_ORGANIZATIONS_SUCCESS, payload: resp }
     ]

    return store.dispatch(actions.setOrgs("/api/",{})).then(() => {
        // return of async actions
        expect(store.getActions()).toEqual(expectedActions)
      })
  })


  it('getAllOrgs', () => {
    jest.spyOn(actions, 'setOrgs').mockReturnValue({})
    jest.spyOn(actions, 'totalOrgs').mockReturnValue({})
    const dispatch = jest.fn()
    dispatch.mockReturnValueOnce({payload:{count:1}}).mockReturnValueOnce({payload:{results:[1]}})
    return actions.getAllOrgs()(dispatch,()=>{}).then(() => {
      // return of async actions
      expect(dispatch).toHaveBeenCalled()
    })
  })



  it('addOrgs', () => {
    jest.spyOn(actions, 'setOrgs').mockReturnValue({})
    const dispatch = jest.fn()
    dispatch.mockReturnValueOnce({})
    const goBack = jest.fn()
    let selections = {
      startDate:new Date(),
    endDate:new Date()}
    let setQuery = jest.fn()
    return actions.addOrgs("url","data","method", goBack)(dispatch,()=>{}).then(() => {
      // return of async actions
      expect(dispatch).toHaveBeenCalled()
      expect(goBack).toHaveBeenCalled()
    })
  })


})
