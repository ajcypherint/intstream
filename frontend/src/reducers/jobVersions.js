import * as jobVersionData from "../actions/jobVersion"
import * as indJobVersionData from "../actions/indJobVersion"

export const initialState = {
  versions:[],
  loading:false,
  totalcount:0,
  errors: {},
  nextpage:null,
  previouspage:null

}
export default (state=initialState, action) => {
  switch(action.type) {
    case indJobVersionData.GET_INDJOBVERSION_REQUEST:
    case jobVersionData.GET_JOBVERSION_REQUEST:
      { 
        return {
          ...state,
          loading:true,
          errors:{}
        }
      }
    case indJobVersionData.GET_INDJOBVERSION_SUCCESS:
    case jobVersionData.GET_JOBVERSION_SUCCESS:
      {
        return {
          versions:action.payload.results,
          loading:false,
          totalcount:action.payload.count,
          errors: {},
          nextpage:action.payload.next,
          previouspage:action.payload.previous,
        }
      }
    case indJobVersionData.GETNO_INDJOBVERSION_FAILURE:
    case indJobVersionData.UPDATE_INDJOBVERSION_FAILURE:
    case indJobVersionData.GET_INDJOBVERSION_FAILURE:
    case jobVersionData.GETNO_JOBVERSION_FAILURE:
    case jobVersionData.UPDATE_JOBVERSION_FAILURE:
    case jobVersionData.GET_JOBVERSION_FAILURE:
      {
        //todo
        return {
          ...state,
          errors:action.payload.response || {'non_field_errors': action.payload.statusText}
        }
        
      }
 
    default:
      return state
  }
}
export function versions(state){
  return state.versions
}
export function loading(state){
  return state.loading
}
export function errors(state){
  return state.errors
}
export function totalcount(state){
  return state.totalcount
}
export function nextpage(state){
  return state.nextpage
}
export function previouspage(state){
  return state.previouspage
}
