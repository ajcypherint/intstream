// reducers/articles.js

import _ from 'lodash';
import * as childArticles from '../actions/childArticles';
import  URL  from  'url-parse'
import {ASC, DESC} from "../util/util"

const setChild = (state, parent, childArticles, loading, totalcount, errors, nextpage, previouspage, saving)=>{
  let child = {  articles:articles,
    loading:loading,
    totalcount:totalcount,
    errors: errors,
    nextpage:nextpage,
    previouspage:previouspage,
    saving:saving
  }
  let state_new = Object.assign(state,{})
  state_new[parent]=child
  return state
}
// use articlestmp to load pages and retrieve data
const initialState ={

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
        let children_new = Object.assign(initialState, {})
        children_new[action.payload.parent]= { articles:[],
                                                loading:true,
                                                totalcount:0,
                                                errors: {},
                                                nextpage:null,
                                                previouspage:null,
                                                saving:false
                                                }

        return children_new
      }

    case childArticles.GET_ARTICLES_SUCCESS:
      {
        //let result = _.mapKeys(action.payload.results, 'id'); // maps id field from array to a property name
        //#let newarticlesourcesData= {...result}
      return {
        ...state,
        articles:action.payload.results,
        totalcount:action.payload.count,
        loading:false,
        nextpage:action.payload.next,
        previouspage:action.payload.previous,
        errors: {},
      }
      }
    case childArticles.GET_ARTICLES_FAILURE:
      {
      return {
        ...state,
        articles:[],
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

export function articles(state) {
  if (state.articles) {
    return  state.articles
  }
}
export function children(state){
  return state.children

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
export function saving(state) {
  return  state.saving
}

export function errors(state) {
  return  state.errors
}
