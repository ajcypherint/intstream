import reducer, { initialState } from '../randomArticle'

import * as actions from '../../actions/randomArticle'

describe('randomArticle', () => {
  it('initial state', () => {
    expect(reducer(undefined, {})).toEqual(
      initialState
    )
  })
  it('get Article request', () => {
    expect(reducer(initialState, {
      type: actions.GET_ARTICLE_REQUEST
    })).toEqual(
      {
        ...initialState,
        loading: true
      }
    )
  })
  it('get article success', () => {
    const payload = { id: 1 }
    expect(reducer({
      ...initialState,
      loading: true
    }, {
      type: actions.GET_ARTICLE_SUCCESS,
      payload: payload
    })).toEqual(
      {
        ...initialState,
        articles: payload,
        loading: false
      }
    )
  })
  it('get article failure', () => {
    const payload = { response: { test: 'test' } }

    expect(reducer({
      ...initialState,
      loading: true
    }, {
      type: actions.GET_ARTICLE_FAILURE,
      payload: payload
    })).toEqual(
      {
        ...initialState,
        errors: payload.response
      }
    )
  })
})
