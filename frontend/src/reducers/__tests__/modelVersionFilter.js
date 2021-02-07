import reducer, { initialState } from '../modelVersionFilter'

import * as actions from '../../actions/modelVersionFilter'

describe('modelVersionFilter', () => {
  it('initial state', () => {
    expect(reducer(undefined, {})).toEqual(
      initialState
    )
  })
  it('clear', () => {
    expect(reducer(initialState, {
      type: actions.CLEAR
    })).toEqual(
      {
        ...initialState
      }
    )
  })
  it('allModels', () => {
    const payload = 1
    expect(reducer(initialState, {
      type: actions.ALL_MLMODELS,
      payload: payload
    })).toEqual(
      {
        ...initialState,
        mlmodels: payload
      }
    )
  })
})
