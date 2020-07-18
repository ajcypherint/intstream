// reducers/trainingScripts.js
//
import _ from 'lodash';
import * as trainingScriptsData from '../actions/trainingScripts';
import  URL  from  'url-parse'

export const initialState ={
  trainingScripts:[],
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
    case trainingScriptsData.TRAININGSCRIPT_FORM_UPDATE:
      {
        return {
          ...state,
          trainingScripts:[action.payload]

        }

      }
    case trainingScriptsData.GET_TOTAL_TRAINING_SCRIPTS:
      {
        return {
        trainingScripts:action.payload.trainingScripts,
        totalcount:action.payload.totalCount,
        allloaded:true,
        loading:false,
        nextpage:null,
        previouspage:null,
        errors: {},
        }

      }
    case trainingScriptsData.SET_TRAINING_SCRIPTS_REQUEST:
      {

      return {
        ...state,
        saving:true
      }
      }
    case trainingScriptsData.SET_TRAINING_SCRIPTS_SUCCESS:
      {
      return {
        ...state,
        trainingScripts:[action.payload],
        saving:false,
      }
      }
    case trainingScriptsData.SET_TRAINING_SCRIPTS_FAILURE:
      {
      return {
        ...state,
        saving:false,
        errors: action.payload.response || {'non_field_errors': action.payload.statusText},
      }
      }
    //used for listing
    case trainingScriptsData.CLEAR:
      {
      return {
        trainingScripts:[],
        totalcount:0,
        loading:false,
        allloaded:false,
        nextpage:null,
        previouspage:null,
        errors:{}
      }
      }

    case trainingScriptsData.GET_TRAINING_SCRIPTS_REQUEST:
      {
      return {
        ...state,
        loading:true,
        allloaded:false,
        errors:{}
      }
      }

    case trainingScriptsData.GET_TRAINING_SCRIPTS_SUCCESS:
      {
      return {
        trainingScripts:action.payload.results,
        totalcount:action.payload.count,
        loading:false,
        allloaded:false,
        nextpage:action.payload.next,
        previouspage:action.payload.previous,
        errors: {},
      }
      }
    case trainingScriptsData.GET_TRAINING_SCRIPTS_FAILURE:
      {
      return {
        trainingScripts:[],
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

export function trainingScripts(state) {
  if (state.trainingScripts) {
    return  state.trainingScripts
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

