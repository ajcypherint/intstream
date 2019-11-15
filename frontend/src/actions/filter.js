import { RSAA } from 'redux-api-middleware';
import { withAuth } from '../reducers'
import _ from 'lodash';
import  URL  from  'url-parse'
import {setParams} from './util'
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
export const  getAllSources = (url, params) =>{
  return async(dispatch, getState) => {
      let extra_params = params || ''
      let totalresp = await dispatch(getfilter(url,extra_params))
      if (totalresp.error) {
      //  // the last dispatched action has errored, break out of the promise chain.
        throw new Error("Promise flow received action error", totalresp);
       }
      let allSources = []
      let total = totalresp.payload.count
      let pages = Math.ceil(total / PAGINATION)
      //ACTIVE, duh time for bed.
      for ( let i=0; i < pages; i++){
       let page = i +1
       let actionResponse = await dispatch(getfilter(url,extra_params+'&page='+page));
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
}

