// reducers/sources.js
//
import _ from 'lodash';
import * as sourcesData from '../actions/sources';
import  URL  from  'url-parse'

const initialState ={
  sources:[],
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
    case sourcesData.GET_TOTAL_SOURCES:
      {
        return {
        sources:action.payload.sources,
        totalcount:action.payload.totalCount,
        allloaded:true,
        loading:false,
        nextpage:null,
        previouspage:null,
        errors: {},
        }

      }
    case sourcesData.SET_SOURCES_REQUEST:
      {

      return {
        ...state,
        saving:true
      }
      }
    case sourcesData.SET_SOURCES_SUCCESS:
      {
      return {
        ...state,
        sources:[action.payload],
        saving:false,
      }
      }
    case sourcesData.SET_SOURCES_FAILURE:
      {
      return {
        ...state,
        saving:false,
        errors: action.payload.response || {'non_field_errors': action.payload.statusText},
      }
      }
    //used for listing
    case sourcesData.CLEAR:
      {
      return {
        sources:[],
        totalcount:0,
        loading:false,
        allloaded:false,
        nextpage:null,
        previouspage:null,
        errors:{}
      }
      }

    case sourcesData.GET_SOURCES_REQUEST:
      {
      return {
        sources:[],
        totalcount:0,
        loading:true,
        allloaded:false,
        nextpage:null,
        previouspage:null,
        errors:{}
      }
      }

    case sourcesData.GET_SOURCES_SUCCESS:
      {
        //let result = _.mapKeys(action.payload.results, 'id'); // maps id field from array to a property name
        //#let newsourcesourcesData= {...result}
      return {
        sources:action.payload.results,
        totalcount:action.payload.count,
        loading:false,
        allloaded:false,
        nextpage:action.payload.next,
        previouspage:action.payload.previous,
        errors: {},
      }
      }
    case sourcesData.GET_SOURCES_FAILURE:
      {
      return {
        sources:[],
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

export function sources(state) {
  if (state.sources) {
    return  state.sources
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

