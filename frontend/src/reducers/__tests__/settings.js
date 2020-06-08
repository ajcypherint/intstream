import reducer from '../settings'
import {initialState} from "../settings"
import * as actions from '../../actions/settings'

describe('settings', () => {
  it('initial state', () => {
    expect(reducer(undefined, {})).toEqual(
			initialState
      )
  })
  it("set form update", () => {
    expect(reducer(initialState, {
      type:actions.FORM_UPDATE,
      payload:{id:"test"}
    })).toEqual(
      {
        ...initialState,
        settings:[{id:"test"}],

      }
    )
  })
  it("get settings request", () => {
    expect(reducer(initialState, {
      type:actions.GET_SETTINGS_REQUEST,
    })).toEqual(
      {
        ...initialState,
        loading:true,
      }
    )
  })
  it("get settings success", () => {
    expect(reducer({
      ...initialState,
      loading:true
    }, {
      type:actions.GET_SETTINGS_SUCCESS,
      payload:{results:["test"]}
    })).toEqual(
      {
        ...initialState,
        settings:["test"],
        loading:false
      }
    )
  })
 
  it("get settings failure", () => {
    let payload = {response:{test:"test"}}

    expect(reducer({
      ...initialState,
      loading:true
    }, {
      type:actions.GET_SETTINGS_FAILURE,
      payload:payload
    })).toEqual(
      {
        ...initialState,
        loading:false,
        errors:payload.response
      }
    )
  })

  it("set settings request", () => {
    expect(reducer(initialState, {
      type:actions.SET_SETTINGS_REQUEST,
    })).toEqual(
      {
        ...initialState,
        saving:true,
      }
    )
  })
  it("set settings success", () => {
    expect(reducer({
      ...initialState,
      saving:true,
    }, {
      type:actions.SET_SETTINGS_SUCCESS,
      payload:"test"
    })).toEqual(
      {
        ...initialState,
        settings:["test"],
        saving:false
      }
    )
  })
 
  it("set settings failure", () => {
    let payload = {response:{test:"test"}}

    expect(reducer({
      ...initialState,
      saving:true
    }, {
      type:actions.SET_SETTINGS_FAILURE,
      payload:payload
    })).toEqual(
      {
        ...initialState,
        saving:false,
        errors:payload.response
      }
    )
  })
})
