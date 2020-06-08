import reducer from '../organizations'
import {initialState, nextPage, previousPage} from "../organizations"
import * as actions from '../../actions/organizations'

describe('organizations', () => {
  it('initial state', () => {
    expect(reducer(undefined, {})).toEqual(
			initialState
      )
  })
  it("set org request", () => {
    expect(reducer(initialState, {
      type:actions.SET_ORGANIZATIONS_REQUEST
    })).toEqual(
      {
        ...initialState,
        saving:true
      }
    )
  })
  it("set org success", () => {
    let payload = {id:1}
    expect(reducer({
      ...initialState,
      saving:true
    }, {
      type:actions.SET_ORGANIZATIONS_SUCCESS,
      payload:payload
    })).toEqual(
      {
        ...initialState,
        orgs:[payload]
      }
    )
  })
  it("set org failure", () => {
    let payload = {response:{test:1}}
    expect(reducer({
      ...initialState,
      saving:true
    }, {
      type:actions.SET_ORGANIZATIONS_FAILURE,
      payload:payload
    })).toEqual(
      {
        ...initialState,
        errors:payload.response
      }
    )
  })
  it("clear", () => {
    expect(reducer({
      ...initialState,
      saving:false
    }, {
      type:actions.CLEAR
    })).toEqual(
      {
         ...initialState,
          orgs:[],
          loading:false,
          totalcount:0,
          errors: {},
          nextpage:null,
          previouspage:null,
          saving:false
        }
    )
  })
  it("get org request", () => {
    expect(reducer(initialState, {
      type:actions.GET_ORGANIZATIONS_REQUEST
    })).toEqual(
      {
        ...initialState,
        loading:true
      }
    )
  })
  it("get org success", () => {
    let payload = {results:{id:1},count:1,next:"test",prev:"test"}
    expect(reducer({
      ...initialState,
      loading:true
    }, {
      type:actions.GET_ORGANIZATIONS_SUCCESS,
      payload:payload
    })).toEqual(
      {
        ...initialState,
        orgs:payload.results,
        totalcount:payload.count,
        loading:false,
        nextpage:payload.next,
        previouspage:payload.previous,
        errors: {},
      }
    )
  })
  it("nextPage", () => {
    let url = {nextpage:"https://test.com/path"}
    let res = nextPage(url)
    expect(res).toBe(
      "/path"
          )
  })
  it("previousPage", () => {
    let url = {previouspage:"https://test.com/path"}
    let res = previousPage(url)
    expect(res).toBe(
      "/path"
          )
  })
 

})
