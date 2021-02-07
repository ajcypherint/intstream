import reducer, { initialState } from '../classifications'

import * as actions from '../../actions/classification'

describe('classification reducer', () => {
  it('initial state', () => {
    expect(reducer(undefined, {})).toEqual(
      initialState
    )
  })
  it('total classifications request', () => {
    expect(
      reducer(undefined, {
        type: actions.GET_TOTAL_CLASSIFICATIONS_REQUEST
      }
      )).toEqual({
      ...initialState,
      totalLoading: true
    }
    )
  })
  it('get total classifications', () => {
    const payload = {
      classif: [{ article_id: 1 }]
    }
    expect(
      reducer({
        ...initialState,
        totalLoading: true
      }
      , {
        type: actions.GET_TOTAL_CLASSIFICATIONS,
        payload: payload
      }
      )).toEqual({
      ...initialState,
      classif: { 1: { article_id: 1 } },
      totalLoading: false
    }
    )
  })
  it('categories fail ', () => {
    expect(
      reducer(
        initialState,
        {
          type: actions.GET_CLASSIFICATIONS_FAILURE,
          payload: { response: { test: 'test' } }
        }
      )).toEqual(
      {
        ...initialState,
        errors: { test: 'test' }
      }
    )
  })
  it('del classification success', () => {
    expect(
      reducer({
        ...initialState,
        classif: { 1: { article_id: 1 } }
      }
      , {
        type: actions.DEL_CLASSIFICATION_SUCCESS,
        meta: { id: 1 }
      }
      )).toEqual({
      ...initialState,
      classif: {}
    }
    )
  })
  it('set classification fail ', () => {
    expect(
      reducer(
        initialState,
        {
          type: actions.SET_CLASSIFICATION_FAILURE,
          payload: { response: { test: 'test' } }
        }
      )).toEqual(
      {
        ...initialState,
        errors: { test: 'test' }
      }
    )
  })
  it('del classification fail ', () => {
    expect(
      reducer(
        initialState,
        {
          type: actions.DEL_CLASSIFICATION_FAILURE,
          payload: { response: { test: 'test' } }
        }
      )).toEqual(
      {
        ...initialState,
        errors: { test: 'test' }
      }
    )
  })
  it('set counts ', () => {
    expect(
      reducer(
        initialState,
        {
          type: actions.SET_COUNTS,
          payload: { test: 1 }
        }
      )).toEqual(
      {
        ...initialState,
        counts: { test: 1 }
      }
    )
  })
  it('clear', () => {
    expect(
      reducer({
        ...initialState,
        classif: { 1: { article_id: 1 } }
      }
      , {
        type: actions.CLEAR
      }
      )).toEqual({
      ...initialState
    }
    )
  })
})
