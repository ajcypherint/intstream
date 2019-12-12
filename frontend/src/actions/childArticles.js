import { RSAA } from 'redux-api-middleware';
import { withAuth } from '../reducers'
import  URL  from  'url-parse'
import {PAGINATION} from "../util/util"
import {setParams} from './util'
export const GET_ARTICLES_REQUEST = '@@childarticles/GET_ARTICLES_REQUEST';
export const GET_ARTICLES_SUCCESS = '@@childarticles/GET_ARTICLES_SUCCESS';
export const GET_ARTICLES_FAILURE = '@@childarticles/GET_ARTICLES_FAILURE';

export const SET_CHILDREN = '@@childarticles/SET_ARTICLES_REQUEST';

export const CLEAR = '@@childarticles/CLEAR';

export const clear= ()=>{
  return {
    type:CLEAR,

  }
}

export const setChildren = (articles)=>{
  return {
    type:SET_CHILDREN,
    payload:articles
  }
}

export const getArticles= (url, params=undefined)=>{
  // filters - list[string]
  url = setParams(url,params)
  return {
  [RSAA]:{
   endpoint: url,
      method: 'GET',
      body: '',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
       GET_ARTICLES_REQUEST, GET_ARTICLES_SUCCESS, GET_ARTICLES_FAILURE
      ]
  }
}
}

export const  getAll=(parent,url,params) =>{
  return async(dispatch, getState) => {
      let extra_params = params || ''
      let totalresp = await dispatch(getArticles(url,extra_params))
      if (totalresp.error) {
      //  // the last dispatched action has errored, break out of the promise chain.
        throw new Error("Promise flow received action error", totalresp);
      }
      let all = []
      let total = totalresp.payload.count
      let pages = Math.ceil(total / PAGINATION)
      //ACTIVE, duh time for bed.
      for ( let i=1; i <= pages; i++){
       let actionResponse = await dispatch(getArticles(url,extra_params+'&page='+i));
      //
       if (actionResponse.error) {
         // the last dispatched action has errored, break out of the promise chain.
         throw new Error("Promise flow received action error", actionResponse);
       }

       all = all.concat(actionResponse.payload.results)
        
      }

      // OR resolve another asyncAction here directly and pass the previous received payload value as argument...
      return await dispatch(setChildren(all, total,parent));
    }
}



