import { RSAA } from 'redux-api-middleware';
import { withAuth } from '../reducers'
import _ from 'lodash';
import  URL  from  'url-parse'
import {setParams, getAll} from './util'
import {PAGINATION} from '../util/util'
import {getSources} from './sources'

export const ALL_SOURCES = '@@filter/TOTAL';
export const HOME = '@@filter/HOME';

export const GET_FILTER_REQUEST = '@@filter/GET_FILTER_REQUEST';
export const GET_FILTER_SUCCESS = '@@filter/GET_FILTER_SUCCESS';
export const GET_FILTER_FAILURE = '@@filter/GET_FILTER_FAILURE';


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
