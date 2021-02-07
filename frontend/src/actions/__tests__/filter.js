import * as actions from '../filter.js'
import configureMockStore from 'redux-mock-store'
import fetchMock from 'fetch-mock'

import { apiMiddleware } from 'redux-api-middleware'
import thunk from 'redux-thunk'
const middlewares = [thunk, apiMiddleware]
const mockStore = configureMockStore(middlewares)
const dispatch = jest.fn()
dispatch.mockReturnValueOnce({}).mockReturnValueOnce({}).mockReturnValue({})
jest.mock('../articles')
describe('filter Change', () => {
  jest.spyOn(actions, 'getAllSources').mockReturnValue({})
  actions.getChildArticles = () => {}
  actions.getArticles = () => {}

  afterEach(() => {
    fetchMock.restore()
  })
  it('filterChange', () => {
    const store = mockStore({ auth: { access: 'xxx' } })
    const selections = {
      startDate: new Date(),
      endDate: new Date()
    }
    const setQuery = jest.fn()
    return actions.filterChange(selections, setQuery)(dispatch, () => {}).then(() => {
      // return of async actions
      expect(true).toEqual(true)
      expect(dispatch).toHaveBeenCalled()
    })
  })
})
