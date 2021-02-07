import { RSAA } from 'redux-api-middleware';
import { withAuth } from '../reducers/util'
import _ from 'lodash';
import  URL  from  'url-parse'
import {setParams,getAll} from './util'
import {PAGINATION} from '../util/util'

export const GET_ORGANIZATIONS_REQUEST = '@@organizations/GET_ORGANIZATIONS_REQUEST';
export const GET_ORGANIZATIONS_SUCCESS = '@@organizations/GET_ORGANIZATIONS_SUCCESS';
export const GET_ORGANIZATIONS_FAILURE = '@@organizations/GET_ORGANIZATIONS_FAILURE';

export const SET_ORGANIZATIONS_REQUEST = '@@organizations/SET_ORGANIZATIONS_REQUEST';
export const SET_ORGANIZATIONS_SUCCESS = '@@organizations/SET_ORGANIZATIONS_SUCCESS';
export const SET_ORGANIZATIONS_FAILURE = '@@organizations/SET_ORGANIZATIONS_FAILURE';

export const FORM_UPDATE = '@@organizations/FORM_UPDATE';

export const CLEAR = '@@organizations/CLEAR';
export const GET_TOTAL_ORGANIZATIONS = '@@organizations/TOTAL';

export const ORGAPI = "/api/organization/"

export const clear = ()=>{
  return {
    type:CLEAR,
    payload:{}

  }
}
export const formUpdate = (data) =>{
  return {
    type: FORM_UPDATE,
    payload:data

  }
}
export const totalOrgs= (data, total) =>{

  return {
    type:GET_TOTAL_ORGANIZATIONS,
    payload:{organizations:data,totalCount:total}
  }
}
export const getOrgs= (url, params=undefined) =>{
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
       GET_ORGANIZATIONS_REQUEST, GET_ORGANIZATIONS_SUCCESS, GET_ORGANIZATIONS_FAILURE
      ]

  }
}
}

export const setOrgs= (url,data,method='PUT' )=>{
  // filters - list[string]
  return {
  [RSAA]:{
   endpoint: url,
    fetch:fetch,
      method: method,
      body: JSON.stringify(data),
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
       SET_ORGANIZATIONS_REQUEST, SET_ORGANIZATIONS_SUCCESS, SET_ORGANIZATIONS_FAILURE
      ]

  }
}
}

export const getAllOrgs= getAll(getOrgs)(totalOrgs);


export const  addOrgs = (url, data, method, goBack) =>{
  return async(dispatch, getState) => {
      let totalresp = await dispatch(setOrgs(url, data, method))
      if (!totalresp.error){
        goBack()
      }
  }
}
 
