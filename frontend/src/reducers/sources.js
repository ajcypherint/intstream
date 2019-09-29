// reducers/sources.js
//
import _ from 'lodash';
import * as sourcesData from '../actions/sources';
import  URL  from  'url-parse'

const initialState ={
  sources:[],
  loading:false,
  totalcount:0,
  errors: {},
  nextpage:null,
  previouspage:null,
}


export default (state=initialState, action) => {
  switch(action.type) {
    case sourcesData.CLEAR:
    case sourcesData.GET_SOURCES_REQUEST:
      {
      return {
        sources:[],
        totalcount:0,
        loading:true,
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
  if (state.nextpage != null){
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

export function errors(state) {
  return  state.errors
}

