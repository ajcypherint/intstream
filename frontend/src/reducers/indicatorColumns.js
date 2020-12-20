// use indicatorstmp to load pages and retrieve data
//
import * as indCol from '../actions/indicatorColumns';

export const initialState ={
  num:[],
  numErrors:{},
  text:[],
  textErrors:{}

}
 
export default (state=initialState, action) => {
  switch(action.type) {
      //used for edit
   case indCol.GET_INDNUMCOLS_REQUEST:
      {

      return {
        ...state,
        errors:{}
      }
      }
    case indCol.GET_INDNUMCOLS_SUCCESS:
      {
      return {
        ...state,
        num:action.payload.results,
      }
      }
    case indCol.GET_INDNUMCOLS_FAILURE:
      {
      return {
        ...state,
        numErrors: action.payload.response || {'non_field_errors': action.payload.statusText},
      }
      }
    case indCol.GET_INDTEXTCOLS_REQUEST:
      {

      return {
        ...state,
        errors:{}
      }
      }
    case indCol.GET_INDTEXTCOLS_SUCCESS:
      {
      return {
        ...state,
        text:action.payload.results,
      }
      }
    case indCol.GET_INDTEXTCOLS_FAILURE:
      {
      return {
        ...state,
        numErrors: action.payload.response || {'non_field_errors': action.payload.statusText},
      }
      }
     default:
      return state


  } 
}

export function getNum(state){
  return state.num
}

export function getText(state){
  return state.text
}

export function getNumErrors(state){
  return state.numErrors
}

export function getTextErrors(state){
  return state.TextErrors
}
