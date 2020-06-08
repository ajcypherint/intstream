import reducer from '../password'
import {initialState} from "../password"
import * as actions from '../../actions/password'

describe('password', () => {
  it('initial state', () => {
    expect(reducer(undefined, {})).toEqual(
			initialState
      )
  })
  it("password success", () => {
    expect(reducer(initialState, {
      type:actions.PASSWORD_SUCCESS
    })).toEqual(
      {
        ...initialState,
        isPasswordChanged:true,
      }
    )
  })
  it("password failed", () => {
    let payload = {response:{test:"test"}}
    expect(reducer(initialState, {
      type:actions.PASSWORD_FAILURE,
      payload:payload
    })).toEqual(
      {
        ...initialState,
        errors:payload.response
      }
    )
  })
  it("password changed", () => {
    expect(reducer(initialState, {
      type:actions.PASSWORD_CHANGED,
      bool:true
    })).toEqual(
      {
        ...initialState,
        isPasswordChanged:true
      }
    )
  })
 
})
