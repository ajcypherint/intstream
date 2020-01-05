import { RSAA } from 'redux-api-middleware';
import {setParams,getAll} from './util'
import { withAuth } from '../reducers'
import  URL  from  'url-parse'
import {getArticles,ARTICLE_URL} from "./articles"

const BASE_URL = "/api/classifications"

export const GET_CLASSIFICATIONS_REQUEST = "@@classification/GET_CLASSIFICATIONS_REQUEST"
export const GET_CLASSIFICATIONS_SUCCESS = "@@classification/GET_CLASSIFICATIONS_SUCCESS"
export const GET_CLASSIFICATIONS_FAILURE = "@@classification/GET_CLASSIFICATIONS_FAILURE"

export const GET_TOTAL_CLASSIFICATIONS= "@@classification/GET_TOTAL_CLASSIFICATIONS"

export const SET_CLASSIFICATION_REQUEST = "@@classification/SET_CLASSIFICATION_REQUEST"
export const SET_CLASSIFICATION_SUCCESS = "@@classification/SET_CLASSIFICATION_SUCCESS"
export const SET_CLASSIFICATION_FAILURE = "@@classification/SET_CLASSIFICATION_FAILURE"

export const CLEAR = "@@classification/CLEAR"

export const clear = ( ) => {
  return {
    type:CLEAR
  }
}

export const getClassifications = (url,params=undefined)=>{
  // filters - list[string]
  url = setParams(url,params)
  return {
  [RSAA]:{
   endpoint: url,
      method: 'GET',
      body: '',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
       GET_CLASSIFICATIONS_REQUEST, GET_CLASSIFICATIONS_SUCCESS, GET_CLASSIFICATIONS_FAILURE
      ]

  }
  }
}

export const setClassification= (url,data,method='POST' )=>{
  // filters - list[string]
  return {
  [RSAA]:{
   endpoint: BASE_URL,
      method: method,
      body: JSON.stringify(data),
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
       SET_CLASSIFICATION_REQUEST, SET_CLASSIFICATION_SUCCESS, SET_CLASSIFICATION_FAILURE
      ]

  }
}
}

export const totalClassifications = (data, total) =>{

  return {
    type:GET_TOTAL_CLASSIFICATIONS,
    payload:{classif:data,totalCount:total}
  }
}


export const getArticleParams = (articles,mlmodel) =>{
  // articles list[int]
  let total_params = ""
  total_params="mlmodel="+mlmodel+"&article_id_in="+articles.join(",")
  return total_params

}

export const getAllClassifications = getAll(getClassifications)(totalClassifications);

export const getArticlesClassif = (model, article_params='')=>{
  return async(dispatch,getState)=>{
    let resp = await dispatch(getArticles(ARTICLE_URL,article_params))
     if (resp.error) {
      //  // the last dispatched action has errored, break out of the promise chain.
        throw new Error("Promise flow received action error", resp);
     }
    let articles = []
    for(let i =0;i<resp.payload.results.length;i++){
      articles.push(resp.payload.results[i].id)
    }
    let total_params = getArticleParams(articles,model)

    resp =  dispatch(getAllClassifications(BASE_URL,total_params))
    if(resp.error){
        throw new Error("Promise flow received action error", resp);
    }
  }

}
