// reducers/models.js
//
import _ from 'lodash';
import * as modelsData from '../actions/models';
import  URL  from  'url-parse'

export const initialState ={
  models:[],
  loading:false,
  allloaded:false,
  totalcount:0,
  errors: {},
  nextpage:null,
  previouspage:null,
  saving:false
}


export default (state=initialState, action) => {
  switch(action.type) {
      //used for edit
    case modelsData.MODEL_FORM_UPDATE:
      {
        return {
          ...state,
          models:[action.payload]

        }

      }
    case modelsData.GET_TOTAL_MODELS:
      {
        return {
        models:action.payload.models,
        totalcount:action.payload.totalCount,
        allloaded:true,
        loading:false,
        nextpage:null,
        previouspage:null,
        errors: {},
        }

      }
    case modelsData.SET_MODELS_REQUEST:
      {

      return {
        ...state,
        saving:true
      }
      }
    case modelsData.SET_MODELS_SUCCESS:
      {
      return {
        ...state,
        models:[action.payload],
        saving:false,
      }
      }
    case modelsData.SET_MODELS_FAILURE:
      {
      return {
        ...state,
        saving:false,
        errors: action.payload.response || {'non_field_errors': action.payload.statusText},
      }
      }
    //used for listing
    case modelsData.CLEAR:
      {
      return {
        models:[],
        totalcount:0,
        loading:false,
        allloaded:false,
        nextpage:null,
        previouspage:null,
        errors:{}
      }
      }

    case modelsData.GET_MODELS_REQUEST:
      {
      return {
        ...state,
        loading:true,
        allloaded:false,
        errors:{}
      }
      }

    case modelsData.GET_MODELS_SUCCESS:
      {
        //let result = _.mapKeys(action.payload.results, 'id'); // maps id field from array to a property name
        //#let newmodelmodelsData= {...result}
      return {
        models:action.payload.results,
        totalcount:action.payload.count,
        loading:false,
        allloaded:false,
        nextpage:action.payload.next,
        previouspage:action.payload.previous,
        errors: {},
      }
      }
    case modelsData.GET_MODELS_FAILURE:
      {
      return {
        models:[],
        totalcount:0,
        loading:false,
        allloaded:false,
        nextpage:null,
        previouspage:null,
         errors: action.payload.response || {'non_field_errors': action.payload.statusText},
      }
      }
    default:
      return state

  }
}

export function totalcount(state){
  return state.totalcount;
}

export function models(state) {
  if (state.models) {
    return  state.models
  }
}

export function nextPage(state){
  if (state.nextpage!= null){
    let fullUrl = new URL(state.nextpage)
    let path = fullUrl.pathname+fullUrl.query
    return path
  }
  else{
    return state.nextpage
  }
}

export function previousPage(state){
  if (state.previouspage != null){
    let fullUrl = new URL(state.previouspage)
    let path = fullUrl.pathname+fullUrl.query
    return path
  }
  else{
    return state.previouspage
  }

}

export function loading(state) {
  return  state.loading
}
export function allLoaded(state){

  return state.allloaded
}
export function saving(state) {
  return  state.saving
}

export function errors(state) {
  return  state.errors
}

