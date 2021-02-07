import reducer, { initialState } from '../categories'

import * as actions from '../../actions/categories'

describe('categories reducer', () => {
  it('initial state', () => {
    expect(reducer(undefined, {})).toEqual(
      initialState
    )
  })
  it('add categories', () => {
    const newCat = 'test'
    expect(
      reducer(initialState, {
        type: actions.ADD_CATEGORIES_SUCCESS,
        category: newCat
      }
      )).toEqual({
      ...initialState,
      categories: [newCat]
    }
    )
  })
  it('success categories', () => {
    const newCat = 'test'
    const res = {
      results: ['test']
    }
    expect(
      reducer(initialState, {
        type: actions.CATEGORIES_SUCCESS,
        payload: res
      }
      )).toEqual({
      ...initialState,
      categories: [newCat]
    }
    )
  })
  it('categories fail ', () => {
    const state = {
      ...initialState
    }

    expect(
      reducer(
        state,
        {
          type: actions.ADD_CATEGORIES_FAILURE,
          payload: { response: { test: 'test' } }
        }
      )).toEqual(
      {
        ...initialState,
        errors: { test: 'test' }
      }
    )
  })
})
