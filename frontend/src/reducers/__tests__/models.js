import reducer, { initialState } from '../models'

import * as actions from '../../actions/models'

describe('modelsreducer', () => {
  it('initial state', () => {
    expect(reducer(undefined, {})).toEqual(
      initialState
    )
  })
  it('set models', () => {
    expect(reducer(initialState, {
      type: actions.SET_MODELS_REQUEST
    })).toEqual(
      {
        ...initialState,
        saving: true

      }
    )
  })
  it('set models success', () => {
    const payload = { id: 1 }
    expect(reducer(initialState, {
      type: actions.SET_MODELS_SUCCESS,
      payload: payload
    })).toEqual(
      {
        ...initialState,
        models: [payload],
        saving: false
      }
    )
  })
  it('set models failure', () => {
    const payload = { response: { test: 'test' } }

    expect(reducer({
      ...initialState,
      saving: true
    }, {
      type: actions.SET_MODELS_FAILURE,
      payload: payload
    })).toEqual(
      {
        ...initialState,
        saving: false,
        errors: payload.response
      }
    )
  })

  it('set models failure', () => {
    expect(reducer(initialState, {
      type: actions.SET_MODELS_REQUEST
    })).toEqual(
      {
        ...initialState,
        saving: true

      }
    )
  })
  it('model form update', () => {
    expect(
      reducer(initialState, {
        type: actions.MODEL_FORM_UPDATE,
        payload: { id: 1 }
      }
      )).toEqual({
      ...initialState,
      models: [{ id: 1 }]
    }
    )
  })
  it('get total models', () => {
    const payload = {
      models: [1],
      totalCount: 1
    }
    expect(
      reducer(initialState, {
        type: actions.GET_TOTAL_MODELS,
        payload: payload
      }
      )).toEqual({
      models: payload.models,
      totalcount: payload.totalCount,
      allloaded: true,
      loading: false,
      nextpage: null,
      previouspage: null,
      errors: {}
    }
    )
  })
})
