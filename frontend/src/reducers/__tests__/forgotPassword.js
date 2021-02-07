import reducer, { initialState } from '../forgotPassword'

import * as actions from '../../actions/forgotPassword'

describe('forgotPassword reducer', () => {
  it('initial state', () => {
    expect(reducer(undefined, {})).toEqual(
      initialState
    )
  })
  it('password reset success', () => {
    expect(
      reducer(initialState, {
        type: actions.PASSWORDRESET_SUCCESS
      }
      )).toEqual({
      ...initialState,
      message: 'email sent'
    }
    )
  })
  it('password reset fail', () => {
    expect(
      reducer(initialState, {
        type: actions.PASSWORDRESET_FAILURE,
        payload: { response: { test: 'fail' } }
      }
      )).toEqual({
      ...initialState,
      errors: { test: 'fail' }
    }
    )
  })
})
