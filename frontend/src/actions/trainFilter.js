import { RSAA } from 'redux-api-middleware';
import { withAuth } from '../reducers'
import _ from 'lodash';
import  URL  from  'url-parse'
import {setParams, getAll} from './util'
import {PAGINATION} from '../util/util'
import {getSources} from './sources'

export const ALL_SOURCES = '@@trainfilter/TOTALSOURCES';
export const ALL_MLMODELS = '@@trainfilter/TOTALMLMODELS';

export const HOME = '@@trainfilter/HOME';
export const PAGE = '@@trainfilter/PAGE';

export const GET_FILTER_REQUEST = '@@trainfilter/GET_FILTER_REQUEST';
export const GET_FILTER_SUCCESS = '@@trainfilter/GET_FILTER_SUCCESS';
export const GET_FILTER_FAILURE = '@@trainfilter/GET_FILTER_FAILURE';


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
