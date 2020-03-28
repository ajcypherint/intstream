import { RSAA } from 'redux-api-middleware';
import { withAuth } from '../reducers'
import _ from 'lodash';
import  URL  from  'url-parse'
import {setParams, getAll} from './util'
import {PAGINATION, dateString} from '../util/util'
import {getSources} from './sources'
import {getModelVersion} from './modelVersion'

export const ALL_MLMODELS = '@@modelversionfilter/TOTALMLMODELS';

export const CLEAR = '@@modelversionfilter/CLEAR';
export const HOME = '@@modelversionfilter/HOME';
export const PAGE = '@@modelversionfilter/PAGE';

export const GET_FILTER_REQUEST = '@@modelversionfilter/GET_FILTER_REQUEST';
export const GET_FILTER_SUCCESS = '@@modelversionfilter/GET_FILTER_SUCCESS';
export const GET_FILTER_FAILURE = '@@modelversionfilter/GET_FILTER_FAILURE';
export const MODEL_API= "/api/mlmodels"
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

export const getAllMLModels = getAll(getfilter)(totalMLModels);

export const filterChange = (newSelections)=>{
  return async (dispatch, getState)=>{
    let resp = await dispatch(setSelections(newSelections))
    if (resp.error) {
      throw new Error("Promise flow received action error" + resp.error);
    }
    let state = getState()
    let selections = state.filterModelVer.Selections

    state = undefined
    let modelStr= "ordering=name&id="+selections.mlmodelChosen+
      "&active=true&modelversion__isnull=false"
    
    //fetch sources and models; * not just sources but all filters not inc dates *
    // could ignore this for child
    resp = await dispatch(getAllMLModels(MODEL_API, modelStr))
    if (resp.error) {
       throw new Error("Promise flow received action error" +  resp.error);
    }

    let mvStr = "ordering="+selections.orderdir+selections.ordercol+
      "&mlmodel="+selections.mlmodelChosen+
      "&page="+selections.page+
      "&mlmodel__active=true"

    //todo(aj) if parents defined use ../action/childArticles; getChildArticles instead.
    return await dispatch(getModelVersion(mvStr))

  }
}


