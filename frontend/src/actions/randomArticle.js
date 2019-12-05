import { RSAA } from 'redux-api-middleware';
import { withAuth } from '../reducers'
import  URL  from  'url-parse'
import {setParams} from './util'

export const GET_ARTICLE_REQUEST = '@@randomarticle/GET_ARTICLE_REQUEST';
export const GET_ARTICLE_SUCCESS = '@@randomarticle/GET_ARTICLE_SUCCESS';
export const GET_ARTICLE_FAILURE = '@@randomarticle/GET_ARTICLE_FAILURE';
export const CLEAR_ARTICLE = '@@randomarticle/CLEAR'

export const clear = ()=>{
  return {
    type:CLEAR_ARTICLE
  }
}
export const getArticle= (model)=>{
  // filters - list[string]
  return {
  [RSAA]:{
    endpoint: "/api/unclass/?model=" + model,
      method: 'GET',
      body: '',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
       GET_ARTICLE_REQUEST, GET_ARTICLE_SUCCESS, GET_ARTICLE_FAILURE
      ]

  }
}
}

