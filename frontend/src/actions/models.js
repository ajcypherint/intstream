import { RSAA } from 'redux-api-middleware';
import { withAuth } from '../reducers/util'
import _ from 'lodash';
import  URL  from  'url-parse'
import {setParams,getAll} from './util'
import {PAGINATION} from '../util/util'

export const GET_MODELS_REQUEST = '@@models/GET_MODELS_REQUEST';
export const GET_MODELS_SUCCESS = '@@models/GET_MODELS_SUCCESS';
export const GET_MODELS_FAILURE = '@@models/GET_MODELS_FAILURE';

export const SET_MODELS_REQUEST = '@@models/SET_MODELS_REQUEST';
export const SET_MODELS_SUCCESS = '@@models/SET_MODELS_SUCCESS';
export const SET_MODELS_FAILURE = '@@models/SET_MODELS_FAILURE';

export const MODEL_FORM_UPDATE = '@@models/MODEL_FORM_UPDATE';

export const CLEAR = '@@models/CLEAR';
export const GET_TOTAL_MODELS = '@@models/TOTAL';

export const API = '/api/mlmodels/'
export const clearModels = ()=>{
  return {
    type:CLEAR,
    payload:{}

  }
}
export const modelFormUpdate = (data) =>{
  return {
    type: MODEL_FORM_UPDATE,
    payload:data

  }
}
export const totalModels = (data, total) =>{

  return {
    type:GET_TOTAL_MODELS,
    payload:{models:data,totalCount:total}
  }
}
export const getModels= (url, params=undefined)=>{
  // filters - list[string]
  url = setParams(url,params)
  return {
  [RSAA]:{
   endpoint: url,
    fetch:fetch,
      method: 'GET',
      body: '',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
       GET_MODELS_REQUEST, GET_MODELS_SUCCESS, GET_MODELS_FAILURE
      ]

  }
}
}

export const setModels= (url,data,method='PUT' )=>{
  // filters - list[string]
  return {
  [RSAA]:{
   endpoint: url,
    fetch:fetch,
      method: method,
      body: JSON.stringify(data),
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
       SET_MODELS_REQUEST, SET_MODELS_SUCCESS, SET_MODELS_FAILURE
      ]

  }
}
}

export const getAllModels=getAll(getModels)(totalModels);


export const  addModels = (url, data, method, goBack) =>{
  return async(dispatch, getState) => {
      let totalresp = await dispatch(setModels(url, data, method))
      if (!totalresp.error){
        goBack()
      }
  }
}
 
