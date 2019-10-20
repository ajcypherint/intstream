import { RSAA } from 'redux-api-middleware';
import { withAuth } from '../reducers'
import  URL  from  'url-parse'
import {setParams} from './util'
import {PAGINATION} from '../util/util'

export const GET_SOURCES_REQUEST = '@@sources/GET_SOURCES_REQUEST';
export const GET_SOURCES_SUCCESS = '@@sources/GET_SOURCES_SUCCESS';
export const GET_SOURCES_FAILURE = '@@sources/GET_SOURCES_FAILURE';

export const SET_SOURCES_REQUEST = '@@sources/SET_SOURCES_REQUEST';
export const SET_SOURCES_SUCCESS = '@@sources/SET_SOURCES_SUCCESS';
export const SET_SOURCES_FAILURE = '@@sources/SET_SOURCES_FAILURE';

export const CLEAR = '@@sources/CLEAR';
export const GET_TOTAL_SOURCES = '@@sources/TOTAL';

export const clearSources = ()=>{
  return {
    type:CLEAR,
    payload:{}

  }
}
export const totalSources = (data, total) =>{

  return {
    type:GET_TOTAL_SOURCES,
    payload:{sources:data,totalCount:total}
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

export const setSources= (url,data,method='PUT' )=>{
  // filters - list[string]
  return {
  [RSAA]:{
   endpoint: url,
      method: method,
      body: JSON.stringify(data),
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
       SET_SOURCES_REQUEST, SET_SOURCES_SUCCESS, SET_SOURCES_FAILURE
      ]

  }
}
}


export const  getAllSources = (url, params) =>{
  return async(dispatch, getState) => {
  try{
    let totalresp = await dispatch(getSources(url))
    if (totalresp.error) {
    //  // the last dispatched action has errored, break out of the promise chain.
      throw new Error("Promise flow received action error", totalresp);
     }
    let allSources = []
    let total = totalresp.payload.count
    let pages = Math.ceil(total / PAGINATION)
    for ( let i=0; i < pages; i++){
     let page = i +1
     let actionResponse = await dispatch(getSources(url,'page='+page));
    //
     if (actionResponse.error) {
       // the last dispatched action has errored, break out of the promise chain.
       throw new Error("Promise flow received action error", actionResponse);
     }

     allSources = allSources.concat(actionResponse.payload.results)
      
    }

    // OR resolve another asyncAction here directly and pass the previous received payload value as argument...
    return await dispatch(totalSources(allSources, total));
  }
    catch(e){
      console.error(e)
    }
  };
}
