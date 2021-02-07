import { RSAA } from 'redux-api-middleware';
import { withAuth } from '../reducers/util'
import  URL  from  'url-parse'
import {setParams} from './util'

export const ARTICLE_URL = "/api/articles"

export const GET_ARTICLES_REQUEST = '@@articles/GET_ARTICLES_REQUEST';
export const GET_ARTICLES_SUCCESS = '@@articles/GET_ARTICLES_SUCCESS';
export const GET_ARTICLES_FAILURE = '@@articles/GET_ARTICLES_FAILURE';

export const SET_ARTICLES_REQUEST = '@@articles/SET_ARTICLES_REQUEST';
export const SET_ARTICLES_SUCCESS = '@@articles/SET_ARTICLES_SUCCESS';
export const SET_ARTICLES_FAILURE = '@@articles/SET_ARTICLES_FAILURE';

export const CLEAR = '@@articles/CLEAR';

export const clearArticles= (data)=>{
  return {
    type:CLEAR,
    payload:data

  }
}

export const getArticles= (url, params=undefined, parent=undefined)=>{
  // filters - list[string]
  url = setParams(url,params)
  return {
    [RSAA]:{
      endpoint: url,
      method: 'GET',
      fetch:fetch,
      body: '',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        {type:GET_ARTICLES_REQUEST, meta:{parent:parent}},
        {type:GET_ARTICLES_SUCCESS, meta:{parent:parent}},
        {type:GET_ARTICLES_FAILURE, meta:{parent:parent}}
        ]


  }
}
}

export const setArticles= (url,data,method='PUT' )=>{
  // filters - list[string]
  return {
    [RSAA]:{
      endpoint: url,
      method: method,
      fetch:fetch,
      body: JSON.stringify(data),
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        SET_ARTICLES_REQUEST, SET_ARTICLES_SUCCESS, SET_ARTICLES_FAILURE
        ]

  }
}
}



