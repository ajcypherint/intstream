// reducers/articles.js

import _ from 'lodash';
import * as childArticles from '../actions/childArticles';
import  URL  from  'url-parse'
import {ASC, DESC} from "../util/util"


// use articlestmp to load pages and retrieve data
const initialState ={
  parentTrail:[],
  articles:[],
  loading:false,
  totalcount:0,
  errors:{},
  nextpage:null,
  previouspage:null,

}


export default (state=initialState, action) => {
  switch(action.type) {
      //used for edit
    case childArticles.CLEAR:
      {
        return {
         ...initialState,
        }
      }

    case childArticles.GET_ARTICLES_REQUEST:
      {
        let new_parent_trail = state.parentTrail.concat(action.meta.parent)
        return {
          ...state,
          parentTrail:new_parent_trail,
          articles:[],
          loading:true,
          totalcount:0,
          errors: {},
          nextpage:null,
          previouspage:null,
          }
      }

    case childArticles.GET_ARTICLES_SUCCESS:
      {
        // todo(aj) filter out any id in parentTrail
      return {
        ...state,
        articles:action.payload.results,
        loading:false,
        totalcount:action.payload.count,
        errors: {},
        nextpage:action.payload.next,
        previouspage:action.payload.previous,
         }
      }
    case childArticles.GET_ARTICLES_FAILURE:
      {
        var new_parent_trail = state.parentTrail.pop() //remove last entry
      return {
        ...state,
        parentTrail:new_parent_trail,
        articles:[],
        loading:false,
        totalcount:0,
        errors: action.payload.response || {'non_field_errors': action.payload.statusText},
        nextpage:null,
        previouspage:null,
        }
      }
    default:
      return state

  }
}



export function totalcount(state){
  return state.totalcount;
}

export function articles(state) {
  if (state.articles) {
    return  state.articles
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
export function parentTrail(state) {
    return  state.parentTrail
}
export function loading(state) {
  return  state.loading
}

export function errors(state) {
  return  state.errors
}

