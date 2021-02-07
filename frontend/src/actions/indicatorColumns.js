import { RSAA } from 'redux-api-middleware';
import { withAuth } from '../reducers/util'
import  URL  from  'url-parse'
import {setParams} from './util'


export const GET_INDNUMCOLS_REQUEST = '@@indcols/GET_INDNUMCOLS_REQUEST';
export const GET_INDNUMCOLS_SUCCESS = '@@indcols/GET_INDNUMCOLS_SUCCESS';
export const GET_INDNUMCOLS_FAILURE = '@@indcols/GET_INDNUMCOLS_FAILURE';

export const GET_INDTEXTCOLS_REQUEST = '@@indcols/GET_INDTEXTCOLS_REQUEST';
export const GET_INDTEXTCOLS_SUCCESS = '@@indcols/GET_INDTEXTCOLS_SUCCESS';
export const GET_INDTEXTCOLS_FAILURE = '@@indcols/GET_INDTEXTCOLS_FAILURE';

export const GET_INDNUMCOLS_DATA_REQUEST = '@@indcols/GET_INDNUMCOLS_DATA_REQUEST';
export const GET_INDNUMCOLS_DATA_SUCCESS = '@@indcols/GET_INDNUMCOLS_DATA_SUCCESS';
export const GET_INDNUMCOLS_DATA_FAILURE = '@@indcols/GET_INDNUMCOLS_DATA_FAILURE';

export const GET_INDTEXTCOLS_DATA_REQUEST = '@@indcols/GET_INDTEXTCOLS_DATA_REQUEST';
export const GET_INDTEXTCOLS_DATA_SUCCESS = '@@indcols/GET_INDTEXTCOLS_DATA_SUCCESS';
export const GET_INDTEXTCOLS_DATA_FAILURE = '@@indcols/GET_INDTEXTCOLS_DATA_FAILURE';


export const CLEAR = '@@indcols/CLEAR';

const COL_NUM_API_URL = "/api/indicatornumericfield/"
const COL_TEXT_API_URL = "/api/indicatortextfield/"
const COL_NUM_NAME_API_URL = "/api/indicatornumericfieldname/"
const COL_TEXT_NAME_API_URL = "/api/indicatortextfieldname/"

export const clearColNumeric= (data)=>{
  return {
    type:CLEAR,
    payload:data

  }
}

export const getColText = (params=undefined)=>{
  // filters - list[string]
  let url = setParams(COL_TEXT_API_URL, params)
  return {
    [RSAA]:{
      endpoint: url,
      method: 'GET',
      fetch:fetch,
      body: '',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
         GET_INDTEXTCOLS_DATA_REQUEST, GET_INDTEXTCOLS_DATA_SUCCESS, GET_INDTEXTCOLS_DATA_FAILURE
        ]

  }
}
}

export const getColNumeric = (params=undefined)=>{
  // filters - list[string]
  let url = setParams(COL_NUM_API_URL, params)
  return {
    [RSAA]:{
      endpoint: url,
      method: 'GET',
      fetch:fetch,
      body: '',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
         GET_INDNUMCOLS_DATA_REQUEST, GET_INDNUMCOLS_DATA_SUCCESS, GET_INDNUMCOLS_DATA_FAILURE
        ]

  }
}
}


export const getColTextName= (params=undefined)=>{
  // filters - list[string]
  let url = setParams(COL_TEXT_NAME_API_URL, params)
  return {
    [RSAA]:{
      endpoint: url,
      method: 'GET',
      fetch:fetch,
      body: '',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
         GET_INDTEXTCOLS_REQUEST, GET_INDTEXTCOLS_SUCCESS, GET_INDTEXTCOLS_FAILURE
        ]

  }
}
}


export const getColNumericName= (params=undefined)=>{
  // filters - list[string]
  let url = setParams(COL_NUM_NAME_API_URL, params)
  return {
    [RSAA]:{
      endpoint: url,
      method: 'GET',
      fetch:fetch,
      body: '',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
         GET_INDNUMCOLS_REQUEST, GET_INDNUMCOLS_SUCCESS, GET_INDNUMCOLS_FAILURE
        ]

  }
}
}


