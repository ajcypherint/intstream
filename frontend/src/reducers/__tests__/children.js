import reducer from '../children'
import {initialState} from "../children"
import * as actions from '../../actions/childArticles'

describe('children reducer', () => {
  it('initial state', () => {
    expect(reducer(undefined, {})).toEqual(
			initialState
      )
  })
  it("get articles request", () => {
    expect(
      reducer(initialState, {
        type:actions.GET_ARTICLES_REQUEST,
      }
      )).toEqual({
        ...initialState,
          articles:[],
          loading:true,
          totalcount:0,
          errors: {},
          nextpage:null,
          previouspage:null,
        }
      )
  })
  it("get Articles Success", () => {
    let newCat = "test"
    let payload = {
      results:[1],
      count:1,
      next:"test",
      previous:"test",

    }
    expect(
      reducer({
        ...initialState,
          articles:[],
          loading:true,
          totalcount:0,
          errors: {},
          nextpage:null,
          previouspage:null,
        } , {
        type:actions.GET_ARTICLES_SUCCESS,
        payload:payload
      }
      )).toEqual({
        ...initialState,
        articles:payload.results,
        loading:false,
        totalcount:payload.count,
        errors: {},
        nextpage:payload.next,
        previouspage:payload.previous,
 
        }
      )
  })
  it("categories fail ", () => {
 
    expect(
      reducer(
        initialState,
        {
          type:actions.GET_ARTICLES_FAILURE,
          payload:{response:{test:"test"}}
        }
      )).toEqual(
        {
        ...initialState,
        articles:[],
        loading:false,
        totalcount:0,
        errors: {test:"test"},
        nextpage:null,
        previouspage:null,
        }
      )
  })

})
