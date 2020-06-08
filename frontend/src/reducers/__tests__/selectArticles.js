import reducer from '../selectArticles'
import {initialState} from "../selectArticles"
import * as actions from '../../actions/selectArticle'

describe('selectArticles', () => {
  it('initial state', () => {
    expect(reducer(undefined, {})).toEqual(
			initialState
      )
  })
  it("get articles request", () => {
    expect(reducer(initialState, {
      type:actions.GET_ARTICLES_REQUEST,
      meta:{id:1}
    })).toEqual(
      {
        ...initialState,
        articles:{
            [1]:{
            id:1,
            loading:true,
            data:{}
            }
          }

      }
    )
  })
  it("get articles success", () => {
    expect(reducer(initialState, {
      type:actions.GET_ARTICLES_SUCCESS,
      meta:{id:1},
      payload:{results:[{id:1}]}
    })).toEqual(
      {
        ...initialState,
        articles:{
            [1]:{
            id:1,
            loading:false,
            data:{id:1}
            }
          }

      }
    )
  })
  it("get articles failed", () => {
    expect(reducer(initialState, {
      type:actions.GET_ARTICLES_FAILURE,
      meta:{id:1},
      payload:{results:[],response:{test:"test"}}
    })).toEqual(
      {
        ...initialState,
        articles:{
          },
        errors:{test:"test"}
      }
    )
  })
  it("clear", () => {
    expect(reducer({
      ...initialState,
      loading:true
    }, {
      type:actions.CLEAR,
    })).toEqual(
      {
        ...initialState,
      }
    )
  })


})
