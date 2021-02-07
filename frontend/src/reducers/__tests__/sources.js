import reducer, { initialState } from '../sources'

import * as actions from '../../actions/sources'

describe('sources', () => {
  it('initial state', () => {
    expect(reducer(undefined, {})).toEqual(
      initialState
    )
  })
  it('form update', () => {
    expect(reducer(initialState, {
      type: actions.SOURCE_FORM_UPDATE,
      payload: { id: 'test' }
    })).toEqual(
      {
        ...initialState,
        sources: [{ id: 'test' }]

      }
    )
  })
  it('get sources request', () => {
    expect(reducer(initialState, {
      type: actions.GET_SOURCES_REQUEST
    })).toEqual(
      {
        ...initialState,
        loading: true
      }
    )
  })
  it('get sources success', () => {
    expect(reducer({
      ...initialState,
      loading: true
    }, {
      type: actions.GET_SOURCES_SUCCESS,
      payload: { results: ['test'], count: 0, next: 'test', previous: 'test' }
    })).toEqual(
      {
        ...initialState,
        sources: ['test'],
        loading: false,
        nextpage: 'test',
        previouspage: 'test',
        totalcount: 0
      }
    )
  })

  it('get sources failure', () => {
    const payload = { response: { test: 'test' } }

    expect(reducer({
      ...initialState,
      loading: true
    }, {
      type: actions.GET_SOURCES_FAILURE,
      payload: payload
    })).toEqual(
      {
        ...initialState,
        loading: false,
        errors: payload.response
      }
    )
  })

  it('set sources request', () => {
    expect(reducer(initialState, {
      type: actions.SET_SOURCES_REQUEST
    })).toEqual(
      {
        ...initialState,
        saving: true
      }
    )
  })
  it('set sources success', () => {
    expect(reducer({
      ...initialState,
      saving: true
    }, {
      type: actions.SET_SOURCES_SUCCESS,
      payload: 'test'
    })).toEqual(
      {
        ...initialState,
        sources: ['test'],
        saving: false
      }
    )
  })

  it('set sources failure', () => {
    const payload = { response: { test: 'test' } }

    expect(reducer({
      ...initialState,
      saving: true
    }, {
      type: actions.SET_SOURCES_FAILURE,
      payload: payload
    })).toEqual(
      {
        ...initialState,
        saving: false,
        errors: payload.response
      }
    )
  })
})
