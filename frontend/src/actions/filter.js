import { RSAA } from 'redux-api-middleware';
import { withAuth } from '../reducers'
import _ from 'lodash';
import  URL  from  'url-parse'
import {setParams, getAll} from './util'
import {PAGINATION, dateString} from '../util/util'
import {getSources} from './sources'
import {getArticles, clearArticles, ARTICLE_URL} from '../actions/articles'

export const API_HOME_ARTICLES = '/api/homearticles/'
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
export const totalActiveModels= (data) =>{

  return {
    type:ALL_ACTIVE_MODELS,
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
export const getAllFilters= getAll(getfilter)(totalActiveModels);


export const filterChange = (newSelections)=>{
  return async (dispatch, getState)=>{
    let resp = await dispatch(setHomeSelections(newSelections))
    if (resp.error) {
       throw new Error("Promise flow received action error" + resp.error);
    }
    let state = getState()
    let selections = state.filter.homeSelections
    state = undefined
    let sourceStr = "start_upload_date="+selections.startDate.toISOString()+
      "&end_upload_date="+selections.endDate.toISOString()+
      "&source="+selections.sourceChosen+
      "&source__active=true"+
      "&prediction__mlmodel="+selections.modelChosen+
       (selections.modelChosen !== "" ?
      "&prediction__mlmodel__active=true": "")
    
    //fetch filters and models
    resp = await dispatch(getAllSources(API_FILTER, sourceStr))
    if (resp.error) {
         throw new Error("Promise flow received action error" +  resp.error);
    }
    let articleStr = dateString(selections.orderdir,
      selections.ordercol,
      selections.sourceChosen,
      selections.page,
      selections.startDate,
      selections.endDate,
      selections.threshold) 
      +"&max_df="+selections.maxDf
      +"&min_df="+selections.minDf 
      +"&prediction__mlmodel="+selections.modelChosen
    state = getState()
    return await dispatch(getArticles(API_HOME_ARTICLES, articleStr))

  }
}


