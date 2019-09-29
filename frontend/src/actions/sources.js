import { RSAA } from 'redux-api-middleware';
import { withAuth } from '../reducers'
import  URL  from  'url-parse'
import {setParams} from './util'

export const GET_SOURCES_REQUEST = '@@sources/GET_SOURCES_REQUEST';
export const GET_SOURCES_SUCCESS = '@@sources/GET_SOURCES_SUCCESS';
export const GET_SOURCES_FAILURE = '@@sources/GET_SOURCES_FAILURE';

export const SET_SOURCES_REQUEST = '@@sources/SET_SOURCES_REQUEST';
export const SET_SOURCES_SUCCESS = '@@sources/SET_SOURCES_SUCCESS';
export const SET_SOURCES_FAILURE = '@@sources/SET_SOURCES_FAILURE';

export const CLEAR = '@@sources/CLEAR';

export const clearSources = ()=>{
  return {
    type:CLEAR,
    payload:{}

  }
}

export const getSources= (url, params=undefined)=>{
  // filters - list[string]
  url = setParams(url,params)
  return {
  [RSAA]:{
   endpoint: url,
      method: 'GET',
      body: '',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
       GET_SOURCES_REQUEST, GET_SOURCES_SUCCESS, GET_SOURCES_FAILURE
      ]

  }
}
}

export const setSources= (url,data )=>{
  // filters - list[string]
  return {
  [RSAA]:{
   endpoint: url,
      method: 'PUT',
      body: JSON.stringify(data),
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
       SET_SOURCES_REQUEST, SET_SOURCES_SUCCESS, SET_SOURCES_FAILURE
      ]

  }
}
}



