import { RSAA } from 'redux-api-middleware';
import { withAuth } from '../reducers'
import _ from 'lodash';
import  URL  from  'url-parse'
import {setParams, getAll} from './util'
import {PAGINATION, dateString} from '../util/util'
import {getSources} from './sources'
import {getArticlesClassif} from './classification'

export const ALL_SOURCES = '@@trainfilter/TOTALSOURCES';
export const ALL_MLMODELS = '@@trainfilter/TOTALMLMODELS';

export const CLEAR = '@@trainfilter/CLEAR';
export const HOME = '@@trainfilter/HOME';
export const PAGE = '@@trainfilter/PAGE';

export const GET_FILTER_REQUEST = '@@trainfilter/GET_FILTER_REQUEST';
export const GET_FILTER_SUCCESS = '@@trainfilter/GET_FILTER_SUCCESS';
export const GET_FILTER_FAILURE = '@@trainfilter/GET_FILTER_FAILURE';
export const CLASSIF_FILTER = "/api/classiffilter/"
export const clear=()=>{
  return {
    type:CLEAR,
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

export const filterChange = (newSelections, setQuery)=>{
  return async (dispatch, getState)=>{
    let orderdir = newSelections.orderdir || ""
    let ordering = newSelections.ordering || ""
    let trueFalse = newSelections.trueFalse || ""
    let sourceChosen = newSelections.sourceChosen || ""
    let mlmodelChosen =   newSelections.mlmodelChosen || ""
    let page = newSelections.page || 1
 
    setQuery(newSelections)
    let targetStr = trueFalse !== "" ?  
        ("&classification__target="+trueFalse+
          "&classification__mlmodel="+mlmodelChosen ) : ""
 
    let sourceStr = "start_upload_date="+newSelections.startDate.toISOString()+
      "&end_upload_date="+newSelections.endDate.toISOString()+
      "&source="+sourceChosen+
      "&source__active=true"+ targetStr
    
    let resp = await dispatch(getAllSources(CLASSIF_FILTER, sourceStr))
    if (resp.error) {
      return
    }

    let articleStr = (dateString(orderdir,
      ordering,
      sourceChosen,
      page,
      newSelections.startDate,
      newSelections.endDate,
      newSelections.threshold) +
      targetStr+ 
      "&source__active=true")

    //todo(aj) if parents defined use ../action/childArticles; getChildArticles instead.
    return await dispatch(getArticlesClassif(mlmodelChosen, articleStr))

  }
}


