import { RSAA } from 'redux-api-middleware';
import { withAuth } from '../reducers'
import _ from 'lodash';
import  URL  from  'url-parse'
import {setParams,getAll} from './util'
import {PAGINATION} from '../util/util'

export const GET_TRAINING_SCRIPTS_REQUEST = '@@models/GET_TRAINING_SCRIPTS_REQUEST';
export const GET_TRAINING_SCRIPTS_SUCCESS = '@@models/GET_TRAINING_SCRIPTS_SUCCESS';
export const GET_TRAINING_SCRIPTS_FAILURE = '@@models/GET_TRAINING_SCRIPTS_FAILURE';

export const SET_TRAINING_SCRIPTS_REQUEST = '@@models/SET_TRAINING_SCRIPTS_REQUEST';
export const SET_TRAINING_SCRIPTS_SUCCESS = '@@models/SET_TRAINING_SCRIPTS_SUCCESS';
export const SET_TRAINING_SCRIPTS_FAILURE = '@@models/SET_TRAINING_SCRIPTS_FAILURE';

export const TRAININGSCRIPT_FORM_UPDATE = '@@models/MODEL_FORM_UPDATE';

export const CLEAR = '@@models/CLEAR';
export const GET_TOTAL_TRAINING_SCRIPTS = '@@models/TOTAL';

export const API = '/api/mlmodels/'
export const clearModels = ()=>{
  return {
    type:CLEAR,
    payload:{}

  }
}
export const trainingScriptFormUpdate = (data) =>{
  return {
    type: TRAININGSCRIPT_FORM_UPDATE,
    payload:data

  }
}
export const totalTrainingScripts = (data, total) =>{

  return {
    type:GET_TOTAL_TRAINING_SCRIPTS,
    payload:{models:data,totalCount:total}
  }
}
export const getTrainingScripts = (url, params=undefined)=>{
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
       GET_TRAINING_SCRIPTS_REQUEST, GET_TRAINING_SCRIPTS_SUCCESS, GET_TRAINING_SCRIPTS_FAILURE
      ]

  }
}
}

export const setTrainingScripts= (url,data,method='PUT' )=>{
  // filters - list[string]
  return {
  [RSAA]:{
   endpoint: url,
    fetch:fetch,
      method: method,
      body: JSON.stringify(data),
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
       SET_TRAINING_SCRIPTS_REQUEST, SET_TRAINING_SCRIPTS_SUCCESS, SET_TRAINING_SCRIPTS_FAILURE
      ]

  }
}
}

export const getAllModels=getAll(getTrainingScripts)(totalTrainingScripts);


export const  addModels = (url, data, method, goBack) =>{
  return async(dispatch, getState) => {
      let totalresp = await dispatch(setTrainingScripts(url, data, method))
      if (!totalresp.error){
        goBack()
      }
  }
}
 
