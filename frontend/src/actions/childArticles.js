import { RSAA } from 'redux-api-middleware';
import { withAuth } from '../reducers'
import  URL  from  'url-parse'
import {PAGINATION} from "../util/util"
import {setParams} from './util'
export const GET_ARTICLES_REQUEST = '@@childarticles/GET_ARTICLES_REQUEST';
export const GET_ARTICLES_SUCCESS = '@@childarticles/GET_ARTICLES_SUCCESS';
export const GET_ARTICLES_FAILURE = '@@childarticles/GET_ARTICLES_FAILURE';

export const SET_CHILDREN = '@@childarticles/SET_ARTICLES_REQUEST';

export const CLEAR = '@@childarticles/CLEAR';

export const clear= ()=>{
  return {
    type:CLEAR,

  }
}

export const setChildren = (articles)=>{
  return {
    type:SET_CHILDREN,
    payload:articles
  }
}

export const getChildArticles= (url, params=undefined)=>{
  // filters - list[string]
  url = setParams(url,params)
  return {
  [RSAA]:{
   endpoint: url,
      method: 'GET',
      body: '',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
       GET_ARTICLES_REQUEST, GET_ARTICLES_SUCCESS, GET_ARTICLES_FAILURE
      ]
  }
}
}

