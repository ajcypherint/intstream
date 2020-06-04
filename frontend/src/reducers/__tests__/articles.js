import reducer from '../articles'
import {initialState} from "../articles"
import * as actions from '../../actions/articles'

describe('articles reducer', () => {
  it('initial state', () => {
    expect(reducer(undefined, {})).toEqual(
			initialState
      )
  })
  
  it('get articles request/success', () => {
    expect(
      reducer(actions.initialState, {
        type: actions.SET_ARTICLES_REQUEST,
      })
    ).toEqual(
      {
			...initialState,
			saving:true	
      }
    )

    let payload = {"test":1}

    expect(
      reducer(
				{
			...initialState,
			saving:true	
      },
        {
          type: actions.SET_ARTICLES_SUCCESS,
          payload: payload
        }
      )
    ).toEqual(
			{
			  ...initialState,
        articles:[payload],
        saving:false,
				
			}
   )
  })
  it('set articles fail', () => {
    expect(
      reducer(actions.initialState, {
        type: actions.SET_ARTICLES_REQUEST,
      })
    ).toEqual(
      {
			...initialState,
			saving:true	
      }
    )

    let payload = {response:"fail"}
    expect(
      reducer(
				{
			...initialState,
			saving:true	
      },
        {
          type: actions.SET_ARTICLES_FAILURE,
          payload: payload
        }
      )
    ).toEqual(
			{
			  ...initialState,
        saving:false,
        errors:payload.response
				
			}
   )
  })

  it("get articles", () =>{
    let request = {
			...initialState,
			loading:true,
      errors:{}
      }
    let res = {
      results:[1],
      count:1,
      next:"test",
      previous:"test"

    }
   
    //request
    expect(
      reducer(actions.initialState, {
        type: actions.GET_ARTICLES_REQUEST,
      })
    ).toEqual(
      request
    )
    //success
    expect(
      reducer(request, {
        type: actions.GET_ARTICLES_SUCCESS,
        payload:res,
      })
    ).toEqual(
      {
        ...request,
        articles:[1],
        totalcount:1,
        loading:false,
        nextpage:"test",
        previouspage:"test"
      }
    )
    let failedres = {
      results:[],
      count:0,
      next:null,
      previous:null

    }
    expect(
       reducer(request, {
        type: actions.GET_ARTICLES_SUCCESS,
        payload:failedres,
      })
    ).toEqual(
      {
        ...request,
        articles:[],
        totalcount:0,
        loading:false,
        nextpage:null,
        previouspage:null
      }
    )
  })
  it("clear", () => {
    expect(
     reducer( {
      ...initialState,
      saving:true
     },
       {type:actions.CLEAR}

     )
    ).toEqual(
        {
          articles:[],
          loading:false,
          totalcount:0,
          errors: {},
          nextpage:null,
          previouspage:null,
          saving:false
        }
    )
  })
})
