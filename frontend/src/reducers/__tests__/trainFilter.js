import reducer, { initialState } from '../trainFilter'

import * as actions from '../../actions/trainFilter'

describe('filter reducer', () => {
  it('initial state', () => {
    expect(reducer(undefined, {})).toEqual(
      initialState
    )
  })
  it('clear', () => {
    expect(
      reducer({
        ...initialState,
        sources: [1]
      }, {
        type: actions.CLEAR
      }
      )).toEqual({
      ...initialState
    }
    )
  })
  it('all mlmodels', () => {
    expect(
      reducer(initialState, {
        type: actions.ALL_MLMODELS,
        payload: [1, 2]
      }
      )).toEqual({
      ...initialState,
      mlmodels: [1, 2]
    }
    )
  })
  it('all sources', () => {
    expect(
      reducer(initialState, {
        type: actions.ALL_SOURCES,
        payload: [1, 2]
      }
      )).toEqual({
      ...initialState,
      sources: [1, 2]
    }
    )
  })
})
