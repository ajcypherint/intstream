import { RSAA } from 'redux-api-middleware';
import { withAuth } from '../reducers'
import  URL  from  'url-parse'
import {setParams} from './util'

export const GET_ARTICLE_REQUEST = '@@randomarticle/GET_ARTICLE_REQUEST';
export const GET_ARTICLE_SUCCESS = '@@randomarticle/GET_ARTICLE_SUCCESS';
export const GET_ARTICLE_FAILURE = '@@randomarticle/GET_ARTICLE_FAILURE';

export const SET_ARTICLE_REQUEST = '@@randomarticle/SET_ARTICLE_REQUEST';
export const SET_ARTICLE_SUCCESS = '@@randomarticle/SET_ARTICLE_SUCCESS';
export const SET_ARTICLE_FAILURE = '@@randomarticle/SET_ARTICLE_FAILURE';

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
    fetch:fetch,
      method: 'GET',
      body: '',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
       GET_ARTICLE_REQUEST, GET_ARTICLE_SUCCESS, GET_ARTICLE_FAILURE
      ]

  }
}
}

export const setClassification= (model,article,target)=>{
  // filters - list[string]
  return {
  [RSAA]:{
    endpoint: "/api/unclass/" + model,
    fetch:fetch,
      method: 'POST',
      body: {model:model,article:article,target:target},
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
       SET_ARTICLE_REQUEST, SET_ARTICLE_SUCCESS, SET_ARTICLE_FAILURE
      ]

  }
}
}

// save and get next
export const classifyNext = (model, article, target)=>{
  return async(dispatch, getState) => {
      let resp = await dispatch(setClassification(model, article, target))
      if (resp.error) {
      //  // the last dispatched action has errored, break out of the promise chain.
        return
       }
      let respnext = await dispatch(getArticle(model))
     if (respnext.error) {
       return
     }
  }
}
