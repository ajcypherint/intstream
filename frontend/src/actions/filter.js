import { RSAA } from 'redux-api-middleware';
import { withAuth } from '../reducers'
import _ from 'lodash';
import  URL  from  'url-parse'
import {setParams, getAll} from './util'
import {PAGINATION, dateString} from '../util/util'
import {getSources} from './sources'
import {getArticles, clearArticles, ARTICLE_URL} from '../actions/articles'
import {setChildHomeSelections} from '../actions/childFilter'
import {getChildArticles} from '../actions/childArticles'

export const API_HOME_ARTICLES = '/api/homearticles/'
export const API_ARTICLES = '/api/articles/'
export const API_FILTER = '/api/homefilter/'
export const MODEL_VERSIONS="/api/modelversion/"
export const ALL_SOURCES = '@@filter/TOTAL';
export const ALL_ACTIVE_MODELS = '@@filter/ALL_ACTIVE_MODELS';
export const HOME = '@@filter/HOME';
export const PAGE = '@@filter/PAGE';

export const GET_FILTER_REQUEST = '@@filter/GET_FILTER_REQUEST';
export const GET_FILTER_SUCCESS = '@@filter/GET_FILTER_SUCCESS';
export const GET_FILTER_FAILURE = '@@filter/GET_FILTER_FAILURE';


export const setPage= (data)=>{
  return {
    type:PAGE,
    payload:data
  }
}
export const setHomeSelections = (data)=>{
  return {
    type:HOME,
    payload:data
  }
}
export const totalSources = (data) =>{

  return {
    type:ALL_SOURCES,
    payload:data
  }
}

export const getfilter= (url, params=undefined)=>{
  // filters - list[string]
  url = setParams(url,params)
  return {
  [RSAA]:{
   endpoint: url,
      method: 'GET',
      body: '',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
       GET_FILTER_REQUEST, GET_FILTER_SUCCESS, GET_FILTER_FAILURE
      ]

  }
}
}

export const getAllSources = getAll(getfilter)(totalSources);

export const filterChange = (newSelections, path='filter', parent)=>{
  return async (dispatch, getState)=>{
    if (!parent){
      let resp = await dispatch(setHomeSelections(newSelections))
      if (resp.error) {
         throw new Error("Promise flow received action error" + resp.error);
      }
    } else {
      let resp = await dispatch(setChildHomeSelections(newSelections))
      if (resp.error) {
         throw new Error("Promise flow received action error" + resp.error);
      }
    }
    let state = getState()
    let selections = state[path].homeSelections
    state = undefined
    let sourceStr = "start_upload_date="+selections.startDate.toISOString()+
      "&end_upload_date="+selections.endDate.toISOString()+
      "&source="+selections.sourceChosen+
      "&source__active=true"+
      "&prediction__mlmodel="+selections.modelChosen+
       (selections.modelChosen !== "" ?
      "&prediction__mlmodel__active=true&prediction__target=true": "")
    
    //fetch sources and models; * not just sources but all filters not inc dates *
    // could ignore this for child
    if(!parent){
      let resp = await dispatch(getAllSources(API_FILTER, sourceStr))
      if (resp.error) {
           throw new Error("Promise flow received action error" +  resp.error);
      }
    }
    
    let articleStr = dateString(selections.orderdir,
      selections.ordercol,
      selections.sourceChosen,
      selections.page,
      selections.startDate,
      selections.endDate,
      selections.threshold) +
      (selections.maxDf ? "&max_df="+ selections.maxDf :'') +
      (selections.MinDf ? "&min_df="+ selections.minDf  : '') +
      "&prediction__mlmodel=" + selections.modelChosen 
    

    state = getState()
    if (parent){
      let {id,title,match} = parent
      for (const x of match){
        articleStr+="&article_id_multi="+x
      }
    }
 
    //todo(aj) if parents defined use ../action/childArticles; getChildArticles instead.
    if (parent){
      return await dispatch(getChildArticles(parent, API_ARTICLES, articleStr))
    } else {
      return await dispatch(getArticles(API_HOME_ARTICLES, articleStr))
    }

  }
}


