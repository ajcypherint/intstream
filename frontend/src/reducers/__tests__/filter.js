import reducer from '../filter'
import {initialState} from "../filter"
import * as actions from '../../actions/filter'

describe('filter reducer', () => {
  it('initial state', () => {
    expect(reducer(undefined, {})).toEqual(
			initialState
      )
  })
  it("all active models", () => {
    expect(
      reducer(initialState, {
        type:actions.ALL_ACTIVE_MODELS,
        payload:[1,2]
      }
      )).toEqual({
        ...initialState,
        models:[1,2]
        }
      )
  })
  it("all active sources", () => {
    expect(
      reducer(initialState, {
        type:actions.ALL_SOURCES,
        payload:[1,2]
      }
      )).toEqual({
        ...initialState,
        sources:[1,2]
        }
      )
  })
})
