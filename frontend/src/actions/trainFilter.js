import { RSAA } from 'redux-api-middleware';
import { withAuth } from '../reducers'
import _ from 'lodash';
import  URL  from  'url-parse'
import {setParams, getAll} from './util'
import {PAGINATION, dateString} from '../util/util'
import {getSources} from './sources'
import {getArticlesAndClassif} from './classification'

export const ALL_SOURCES = '@@trainfilter/TOTALSOURCES';
export const ALL_MLMODELS = '@@trainfilter/TOTALMLMODELS';

export const CLEAR = '@@trainfilter/CLEAR';
export const HOME = '@@trainfilter/HOME';
export const PAGE = '@@trainfilter/PAGE';

export const GET_FILTER_REQUEST = '@@trainfilter/GET_FILTER_REQUEST';
export const GET_FILTER_SUCCESS = '@@trainfilter/GET_FILTER_SUCCESS';
export const GET_FILTER_FAILURE = '@@trainfilter/GET_FILTER_FAILURE';
export const CLASSIF_FILTER = "/api/classiffilter"
export const clear=()=>{
  return {
    type:CLEAR,
  }
}
export const setPage= (data)=>{
  return {
    type:PAGE,
    payload:data
  }
}
export const setSelections = (data)=>{
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
export const totalMLModels= (data) =>{

  return {
    type:ALL_MLMODELS,
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

export const getAllMLModels = getAll(getfilter)(totalMLModels);

export const filterChange = (newSelections)=>{
  return async (dispatch, getState)=>{
    let resp = await dispatch(setSelections(newSelections))
    if (resp.error) {
      throw new Error("Promise flow received action error" + resp.error);
    }
    let state = getState()
    let selections = state.trainFilter.Selections
    let targetStr = selections.trueFalse !== "" ?  
        ("&classification__target="+selections.trueFalse+
          "&classification__mlmodel="+selections.mlmodelChosen ) : ""
 
    state = undefined
    let sourceStr = "start_upload_date="+selections.startDate.toISOString()+
      "&end_upload_date="+selections.endDate.toISOString()+
      "&source="+selections.sourceChosen+
      "&source__active=true"+ targetStr
    
    //fetch sources and models; * not just sources but all filters not inc dates *
    // could ignore this for child
    resp = await dispatch(getAllSources(CLASSIF_FILTER, sourceStr))
    if (resp.error) {
       throw new Error("Promise flow received action error" +  resp.error);
    }

    let articleStr = (dateString(selections.orderdir,
      selections.ordercol,
      selections.sourceChosen,
      selections.page,
      selections.startDate,
      selections.endDate,
      selections.threshold) +
      targetStr+ 
      "&source__active=true")

    //todo(aj) if parents defined use ../action/childArticles; getChildArticles instead.
    return await dispatch(getArticlesAndClassif(selections.mlmodelChosen, articleStr))

  }
}


