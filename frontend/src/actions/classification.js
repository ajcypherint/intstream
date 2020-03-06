import { RSAA } from 'redux-api-middleware';
import {setParams,getAll} from './util'
import { withAuth } from '../reducers'
import  URL  from  'url-parse'
import * as fromArticle from "./articles"

const BASE_URL = "/api/classifications/"
export const GET_ARTICLES_REQUEST = "@@classification/GET_ARTICLES_REQUEST"
export const GET_ARTICLES_SUCCESS = "@@classification/GET_ARTICLES_SUCCESS"
export const GET_ARTICLES_FAILURE = "@@classification/GET_ARTICLES_FAILURE"


export const GET_CLASSIFICATIONS_REQUEST = "@@classification/GET_CLASSIFICATIONS_REQUEST"
export const GET_CLASSIFICATIONS_SUCCESS = "@@classification/GET_CLASSIFICATIONS_SUCCESS"
export const GET_CLASSIFICATIONS_FAILURE = "@@classification/GET_CLASSIFICATIONS_FAILURE"

export const GET_TOTAL_CLASSIFICATIONS= "@@classification/GET_TOTAL_CLASSIFICATIONS"

export const GET_TOTAL_CLASSIFICATIONS_REQUEST= "@@classification/GET_TOTAL_CLASSIFICATIONS_REQUEST"

export const SET_CLASSIFICATION_REQUEST = "@@classification/SET_CLASSIFICATION_REQUEST"
export const SET_CLASSIFICATION_SUCCESS = "@@classification/SET_CLASSIFICATION_SUCCESS"
export const SET_CLASSIFICATION_FAILURE = "@@classification/SET_CLASSIFICATION_FAILURE"

export const DEL_CLASSIFICATION_REQUEST = "@@classification/DEL_CLASSIFICATION_REQUEST"
export const DEL_CLASSIFICATION_SUCCESS = "@@classification/DEL_CLASSIFICATION_SUCCESS"
export const DEL_CLASSIFICATION_FAILURE = "@@classification/DEL_CLASSIFICATION_FAILURE"

export const SET_COUNTS = "@@classification/COUNTS"

export const CLEAR = "@@classification/CLEAR"

export const getArticles= (url, params=undefined)=>{
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


export const clear = ( ) => {
  return {
    type:CLEAR
  }
}

export const setCounts = (total, true_count, false_count) =>{
  return {
    type:SET_COUNTS,
    payload:{
      true_count:true_count,
      false_count:false_count,
      total:total
    }
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

export const getCounts = (mlmodel)=>{
 return async (dispatch, getState)=>{
   let true_resp = await dispatch(getClassifications(BASE_URL, "mlmodel_id="+mlmodel+"&target=true"))
   if (true_resp.error) {
     throw new Error("Promise flow received action error", true_resp);
   }
   let false_resp = await dispatch(getClassifications(BASE_URL, "mlmodel_id="+mlmodel+"&target=false"))
     if (false_resp.error) {
       throw new Error("Promise flow received action error", false_resp);
   }
   let true_count = parseInt(true_resp.payload.count, 10)
   let false_count = parseInt(false_resp.payload.count, 10)
   let total =true_count + false_count
   await dispatch(setCounts(total, true_count, false_count))
 }
}

export const deleteClassification= ( id, article_id )=>{
  // filters - list[string]
  return {
  [RSAA]:{
    endpoint: BASE_URL +  id + "/",
      method: "DELETE",
      body: '',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        {type:DEL_CLASSIFICATION_REQUEST, meta:{id:article_id}},
        {type:DEL_CLASSIFICATION_SUCCESS, meta:{id:article_id}},
        {type:DEL_CLASSIFICATION_FAILURE, meta:{id:article_id}}
      ]

  }
}
}
export const deleteClassificationLoadCounts = (id, article_id, mlmodel)=>{
  return async(dispatch, getState)=>{
    let resp = await dispatch(deleteClassification(id, article_id))
    if(resp.errors){
      throw new Error("Promise flow received action error", resp);
    }
    await dispatch(getCounts(mlmodel))
  }

}
export const setClassification= ( mlmodel,
                                 article,
                                 target,
                                 method='POST' )=>{
  let data = {
    article_id:article,
    mlmodel_id:mlmodel,
    target:target
    }
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

export const setClassificationLoadCounts = (mlmodel,
                                      article,
                                      target,
                                      )=>{
    return async(dispatch, getState)=>{
    let resp = await dispatch(setClassification(mlmodel, article, target))
    if(resp.errors){
      throw new Error("Promise flow received action error", resp);
      }
    await dispatch(getCounts(mlmodel))
 
  }
  

}

export const totalClassifications = (data, total) =>{
  return {
    type:GET_TOTAL_CLASSIFICATIONS,
    payload:{classif:data,totalCount:total}
  }
}

export const totalClassificationsRequest = ()=> {
  return {
    type:GET_TOTAL_CLASSIFICATIONS_REQUEST,
  }

}

export const getArticleParams = (articles,mlmodel) =>{
  // articles list[int]
  let total_params = ""
  total_params="mlmodel_id="+mlmodel+"&article_id_in="+articles.join(",")
  return total_params

}

export const getAllClassifications = getAll(getClassifications)(totalClassifications);

export const getArticlesAndClassif = (model, article_params = '')=>{
  return async(dispatch, getState)=>{
    let resp = await dispatch(fromArticle.getArticles(fromArticle.ARTICLE_URL,article_params))
    if (resp.error) {
      // the last dispatched action has errored, break out of the promise chain.
      throw new Error("Promise flow received action error", resp);
    }
    return await dispatch(getArticlesClassif(model, article_params))
 
  }
}
export const getArticlesClassif = (model, article_params='')=>{
  return async(dispatch,getState)=>{
    let resp = await dispatch(getArticles(fromArticle.ARTICLE_URL,article_params))
     if (resp.error) {
      //  // the last dispatched action has errored, break out of the promise chain.
        throw new Error("Promise flow received action error", resp);
     }
    let articles = []
    if(resp.payload.results.length > 0){
      for(let i =0;i<resp.payload.results.length;i++){
        articles.push(resp.payload.results[i].id)
      }
      let total_params = getArticleParams(articles,model)
      //todo(aj) move this to component instead.??
      await dispatch(getCounts(model))
      await dispatch(totalClassificationsRequest()) 
      await dispatch(getAllClassifications(BASE_URL,total_params))
   } else {
     return await dispatch(getCounts(model))
   }
  }
}

