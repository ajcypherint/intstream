// reducers/articles.js
//
import _ from 'lodash';
import * as articlesData from '../actions/articles';
import  URL  from  'url-parse'
import {ASC, DESC} from "../util/util"

let START = new Date();
START.setHours(0,0,0,0);

let END= new Date();
END.setHours(23, 59, 59, 999);

// use articlestmp to load pages and retrieve data
export const initialState ={
  articles:[],
  loading:false,
  totalcount:0,
  errors: {},
  nextpage:null,
  previouspage:null,
  saving:false
}


export default (state=initialState, action) => {
  switch(action.type) {
      //used for edit
   case articlesData.SET_ARTICLES_REQUEST:
      {

      return {
        ...state,
        saving:true
      }
      }
    case articlesData.SET_ARTICLES_SUCCESS:
      {
      return {
        ...state,
        articles:[action.payload],
        saving:false,
      }
      }
    case articlesData.SET_ARTICLES_FAILURE:
      {
      return {
        ...state,
        saving:false,
        errors: action.payload.response || {'non_field_errors': action.payload.statusText},
      }
      }
    //used for listing
    case articlesData.CLEAR:
      {
        return {
         ...state,
          articles:[],
          loading:false,
          totalcount:0,
          errors: {},
          nextpage:null,
          previouspage:null,
          saving:false
        }
      }

    case articlesData.GET_ARTICLES_REQUEST:
      {
      return {
        ...state,
        loading:true,
        errors:{}
      }
      }

    case articlesData.GET_ARTICLES_SUCCESS:
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
    case articlesData.GET_ARTICLES_FAILURE:
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

