import * as actions from '../modelVersion.js'
import configureMockStore from 'redux-mock-store'
import fetchMock from 'fetch-mock'

import { apiMiddleware } from 'redux-api-middleware'
import thunk from 'redux-thunk'
const middlewares = [thunk, apiMiddleware]
const mockStore = configureMockStore(middlewares)

describe('modelVersion', () => {
  afterEach(() => {
    fetchMock.restore()
  })
  it('trainRedirect', () => {
    const dispatch = jest.fn()
    const res1 = {
      payload: {
        results: [{ id: 1 }]
      }
    }
    const push = jest.fn()
    dispatch.mockReturnValueOnce({})
    jest.spyOn(actions, 'train').mockReturnValue({})

    return actions.trainRedirect({}, { push: push }, 'test', 'test', 'test')(dispatch, () => {}).then(() => {
      // return of async actions
      expect(dispatch).toHaveBeenCalled()
      expect(push).toHaveBeenCalled()
    })
  })

  it('setActiveRequest', () => {
    const store = mockStore({ auth: { access: 'xxx' } })
    const resp = { test: 1 }
    const id = 1
    const endpoint = '/api/modelversion/1/?'
    fetchMock.patchOnce(endpoint, {
      body: resp,
      headers: { 'content-type': 'application/json' }
    })

    const expectedActions = [
      { type: actions.UPDATE_MODELVERSION_REQUEST },
      { type: actions.UPDATE_MODELVERSION_SUCCESS, payload: resp }
    ]

    return store.dispatch(actions.setActiveRequest(id, true)).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
  it('getModelVersion', () => {
    const store = mockStore({ auth: { access: 'xxx' } })
    const resp = { test: 1 }
    const id = 1
    const endpoint = '/api/modelversion/'
    fetchMock.getOnce(endpoint, {
      body: resp,
      headers: { 'content-type': 'application/json' }
    })

    const expectedActions = [
      { type: actions.GET_MODELVERSION_REQUEST },
      { type: actions.GET_MODELVERSION_SUCCESS, payload: resp }
    ]

    return store.dispatch(actions.getModelVersion()).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('getModelVersionNoRedux', () => {
    const store = mockStore({ auth: { access: 'xxx' } })
    const resp = { test: 1 }
    const id = 1
    const endpoint = '/api/modelversion/'
    fetchMock.getOnce(endpoint, {
      body: resp,
      headers: { 'content-type': 'application/json' }
    })

    const expectedActions = [
      { type: actions.GETNO_MODELVERSION_REQUEST },
      { type: actions.GETNO_MODELVERSION_SUCCESS, payload: resp }
    ]

    return store.dispatch(actions.getModelVersionNoRedux()).then(() => {
      // return of async actions
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('setActiveVersion', () => {
    const dispatch = jest.fn()
    const res1 = {
      payload: {
        results: [{ id: 1 }]
      }
    }
    dispatch.mockReturnValueOnce(res1).mockReturnValueOnce({}).mockReturnValue({}).mockReturnValue({})
    jest.spyOn(actions, 'getModelVersionNoRedux').mockReturnValue({})
    jest.spyOn(actions, 'setActiveRequest').mockReturnValue({}).mockReturnValue({})
    actions.filterChange = jest.fn().mockReturnValue({})
    const setQuery = jest.fn()
    const id = 1
    const model = 1

    const selections = {
      startDate: new Date(),
      endDate: new Date()
    }

    return actions.setActiveVersion(model, id, selections, setQuery)(dispatch, () => {}).then(() => {
      // return of async actions
      expect(dispatch).toHaveBeenCalled()
    })
  })
})
