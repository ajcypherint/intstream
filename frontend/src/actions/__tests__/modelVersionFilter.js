import * as actions from '../modelVersionFilter.js'
import configureMockStore from 'redux-mock-store'
import fetchMock from 'fetch-mock'

import { apiMiddleware } from 'redux-api-middleware'
import thunk from 'redux-thunk'
const dispatch = jest.fn()
dispatch.mockReturnValueOnce({}).mockReturnValueOnce({}).mockReturnValue({})
const middlewares = [thunk, apiMiddleware]
const mockStore = configureMockStore(middlewares)

describe('modelVersionFilter', () => {
  afterEach(() => {
    fetchMock.restore()
  })
  it('modelVersionFilter', () => {
    jest.spyOn(actions, 'getAllMLModels').mockReturnValue({}).mockReturnValue({})
    actions.getChildArticles = () => {}
    actions.getArticles = () => {}

    const store = mockStore({ auth: { access: 'xxx' } })
    const selections = {
      startDate: new Date(),
      endDate: new Date()
    }
    const setQuery = jest.fn()
    return actions.filterChange(selections, setQuery)(dispatch, () => {}).then(() => {
      // return of async actions
      expect(dispatch).toHaveBeenCalled()
    })
  })
})
