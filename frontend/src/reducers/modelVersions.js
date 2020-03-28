import * as modelVersionData from "../actions/modelVersion"

const initialState = {
  versions:[],
  loading:false,
  totalcount:0,
  trainuuid:'',
  errors: {},
  nextpage:null,
  previouspage:null

}
export default (state=initialState, action) => {
  switch(action.type) {
    case modelVersionData.GET_MODELVERSION_REQUEST:
      { 
        return {
          ...state,
          loading:true,
          errors:{}
        }
      }
    case modelVersionData.TRAIN_MODELVERSION_REQUEST:
      { 
        return {
          ...state,
          errors:{}
        }
      }
    case modelVersionData.TRAIN_MODELVERSION_SUCCESS:
      {
        return {
          ...state,
          trainuuid:action.payload.job_id
        }
      }
    case modelVersionData.GET_MODELVERSION_SUCCESS:
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
    case modelVersionData.GETNO_MODELVERSION_FAILURE:
    case modelVersionData.UPDATE_MODELVERSION_FAILURE:
    case modelVersionData.TRAIN_MODELVERSION_FAILURE:
    case modelVersionData.GET_MODELVERSION_FAILURE:
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
export function trainuuid(state){
  return state.trainuuid
}
