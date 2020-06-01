import { RSAA } from 'redux-api-middleware';
import { withAuth } from '../reducers'
import _ from 'lodash';
import  URL  from  'url-parse'
import {setParams,getAll} from './util'
import {PAGINATION} from '../util/util'

export const GET_SETTINGS_REQUEST = '@@settings/GET_SETTINGS_REQUEST';
export const GET_SETTINGS_SUCCESS = '@@settings/GET_SETTINGS_SUCCESS';
export const GET_SETTINGS_FAILURE = '@@settings/GET_SETTINGS_FAILURE';

export const SET_SETTINGS_REQUEST = '@@settings/SET_SETTINGS_REQUEST';
export const SET_SETTINGS_SUCCESS = '@@settings/SET_SETTINGS_SUCCESS';
export const SET_SETTINGS_FAILURE = '@@settings/SET_SETTINGS_FAILURE';

export const FORM_UPDATE = '@@settings/FORM_UPDATE';

export const CLEAR = '@@settings/CLEAR';
export const GET_TOTAL_SETTINGS = '@@settings/TOTAL';

export const clear = ()=>{
  return {
    type:CLEAR,
    payload:{}

  }
}
export const FormUpdate = (data) =>{
  return {
    type: FORM_UPDATE,
    payload:data

  }
}
export const total = (data, total) =>{

  return {
    type:GET_TOTAL_SETTINGS,
    payload:{settings:data,totalCount:total}
  }
}
export const getSettings = (url, params=undefined)=>{
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
       GET_SETTINGS_REQUEST, GET_SETTINGS_SUCCESS, GET_SETTINGS_FAILURE
      ]

  }
}
}

export const setSettings = (url,data,method='POST' )=>{
  // filters - list[string]
  return {
  [RSAA]:{
   endpoint: url,
    fetch:fetch,
      method: method,
      body: JSON.stringify(data),
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
       SET_SETTINGS_REQUEST, SET_SETTINGS_SUCCESS, SET_SETTINGS_FAILURE
      ]

  }
}
}

export const getAllSettings=getAll(getSettings)(total);


