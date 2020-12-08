import { RSAA } from 'redux-api-middleware';
import { withAuth } from '../reducers'
import  URL  from  'url-parse'
import {setParams} from './util'
 
const setParamsType = function(url, type, params){
  if (typeof type !== 'undefined'){
    url = url + type +"/"
  }
  if ( typeof params !== 'undefined'){
    url+='?'+params;
  }
  return url;
}

export const INDICATOR_URL = "/api/indicator"

export const GET_INDICATORS_REQUEST = '@@indicators/GET_INDICATORS_REQUEST';
export const GET_INDICATORS_SUCCESS = '@@indicators/GET_INDICATORS_SUCCESS';
export const GET_INDICATORS_FAILURE = '@@indicators/GET_INDICATORS_FAILURE';

export const GET_MD5_REQUEST = '@@indicators/GET_MD5_REQUEST';
export const GET_MD5_SUCCESS = '@@indicators/GET_MD5_SUCCESS';
export const GET_MD5_FAILURE = '@@indicators/GET_MD5_FAILURE';

export const GET_SHA1_REQUEST = '@@indicators/GET_SHA1_REQUEST';
export const GET_SHA1_SUCCESS = '@@indicators/GET_SHA1_SUCCESS';
export const GET_SHA1_FAILURE = '@@indicators/GET_SHA1_FAILURE';

export const GET_SHA256_REQUEST = '@@indicators/GET_SHA256_REQUEST';
export const GET_SHA256_SUCCESS = '@@indicators/GET_SHA256_SUCCESS';
export const GET_SHA256_FAILURE = '@@indicators/GET_SHA256_FAILURE';

export const GET_IPV4_REQUEST = '@@indicators/GET_IPV4_REQUEST';
export const GET_IPV4_SUCCESS = '@@indicators/GET_IPV4_SUCCESS';
export const GET_IPV4_FAILURE = '@@indicators/GET_IPV4_FAILURE';


export const SET_INDICATORS_REQUEST = '@@indicators/SET_INDICATORS_REQUEST';
export const SET_INDICATORS_SUCCESS = '@@indicators/SET_INDICATORS_SUCCESS';
export const SET_INDICATORS_FAILURE = '@@indicators/SET_INDICATORS_FAILURE';

export const CLEAR = '@@indicators/CLEAR';
export const API_MD5 = "/api/indicatormd5/";
export const API_SHA1 = "/api/indicatorsha1/";
export const API_SHA256 = "/api/indicatorsha256/";

export const clearIndicators = (data)=>{
  return {
    type:CLEAR,
    payload:data

  }
}
export const getIPV4= ( params) => {
  let url = setParams("/api/indicatoripv4/", params)
  return {
    [RSAA]:{
      endpoint: url,
      method: 'GET',
      fetch:fetch,
      body: '',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
         GET_IPV4_REQUEST, GET_IPV4_SUCCESS, GET_IPV4_FAILURE
        ]

    }
  }
}
export const getSHA1= ( params) => {
  let url = setParams("/api/indicatorsha1/", params)
  return {
    [RSAA]:{
      endpoint: url,
      method: 'GET',
      fetch:fetch,
      body: '',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
         GET_SHA1_REQUEST, GET_SHA1_SUCCESS, GET_SHA1_FAILURE
        ]

    }
  }
}
export const getSHA256 = ( params) => {
  let url = setParams("/api/indicatorsha256/", params)
  return {
    [RSAA]:{
      endpoint: url,
      method: 'GET',
      fetch:fetch,
      body: '',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
         GET_SHA256_REQUEST, GET_SHA256_SUCCESS, GET_SHA256_FAILURE
        ]

    }
  }
}
export const getMD5 = ( params) => {

  let url = setParams("/api/indicatormd5/", params)
  return {
    [RSAA]:{
      endpoint: url,
      method: 'GET',
      fetch:fetch,
      body: '',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
         GET_MD5_REQUEST, GET_MD5_SUCCESS, GET_MD5_FAILURE
        ]

    }
  }
}
export const getIndicators= (url, type=undefined, params=undefined)=>{
  // filters - list[string]
  url = setParamsType(url,type, params)
  
  return {
    [RSAA]:{
      endpoint: url,
      method: 'GET',
      fetch:fetch,
      body: '',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
         GET_INDICATORS_REQUEST, GET_INDICATORS_SUCCESS, GET_INDICATORS_FAILURE
        ]

  }
}
}

export const setIndicators= (url,data,method='PUT' )=>{
  // filters - list[string]
  return {
    [RSAA]:{
      endpoint: url,
      method: method,
      fetch:fetch,
      body: JSON.stringify(data),
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        SET_INDICATORS_REQUEST, SET_INDICATORS_SUCCESS, SET_INDICATORS_FAILURE
        ]

  }
}
}



