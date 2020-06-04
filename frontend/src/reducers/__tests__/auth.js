import reducer from '../auth'
import {initialState} from "../auth"
import * as actions from '../../actions/auth'

describe('auth reducer', () => {
  it('initial state', () => {
    expect(reducer(undefined, {})).toEqual(
			initialState
      )
  })
  it("set user", () => {
    let res = {
      username:"test"
    }
    expect(
      reducer(actions.initialState, {
        type:actions.SET_USER,
        payload:res
      }
      )).toEqual({
        ...initialState,
        ...res
        }
      )
    
  })
  it("logout", () => {
    let state = {
      ...initialState,
      access:"test",
      refresh:"test"
    }
    expect(
      reducer(
        state,
        {
          type:actions.LOGOUT,
          payload:{}
        }
      )).toEqual(
        {
        ...initialState
        }
      )

  })
  it("fail ", () => {
    let state = {
      ...initialState,
      access:"test",
      refresh:"test"
    }
 
    expect(
      reducer(
        state,
        {
          type:actions.USERINFO_FAILURE,
          payload:{response:{test:"test"}}
        }
      )).toEqual(
        {
          ...initialState,
          errors:{test:"test"}
        }
      )

    expect(
      reducer(
        state,
        {
          type:actions.LOGIN_FAILURE,
          payload:{response:{test:"test"}}
        }
      )).toEqual(
        {
          ...initialState,
          errors:{test:"test"}
        }
      )

    expect(
      reducer(
        state,
        {
          type:actions.TOKEN_FAILURE,
          payload:{response:{test:"test"}}
        }
      )).toEqual(
        {
          ...initialState,
          errors:{test:"test"}
        }
      )



  })
  it('get user infosuccess', () => {
    let res = {results:[
      {
        is_integrator:true,
        is_superuser:true,
        is_staff:true
      }

    ]

    }
    expect(
      reducer(actions.initialState, {
        type: actions.USERINFO_SUCCESS,
        payload:res
      })
    ).toEqual(
      {
			...initialState,
        isIntegrator:true,
        isSuperuser:true,
        isStaff:true
      }
    )
  })

})
