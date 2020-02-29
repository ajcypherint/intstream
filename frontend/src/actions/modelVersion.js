import { RSAA } from 'redux-api-middleware';
import { withAuth } from '../reducers'
import {setParams,getAll} from './util'

let ENDPOINT = 'api/modelversion/'
export const GET_MODELVERSION_REQUEST = '@@modelVersion/GET_MODELVERSION_REQUEST';
export const GET_MODELVERSION_SUCCESS = '@@modelVersion/GET_MODELVERSION_SUCCESS';
export const GET_MODELVERSION_FAILURE = '@@modelVersion/GET_MODELVERSION_FAILURE';

export const TRAIN_MODELVERSION_REQUEST = '@@modelVersion/TRAIN_MODELVERSION_REQUEST';
export const TRAIN_MODELVERSION_SUCCESS = '@@modelVersion/TRAIN_MODELVERSION_SUCCESS';
export const TRAIN_MODELVERSION_FAILURE = '@@modelVersion/TRAIN_MODELVERSION_FAILURE';


export const train= (data)=>{
  return {
  [RSAA]:{
   endpoint: ENDPOINT,
      method: 'POST',
      body: JSON.Stringify(data),
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
       TRAIN_MODELVERSION_REQUEST, TRAIN_MODELVERSION_SUCCESS, TRAIN_MODELVERSION_FAILURE
      ]

  }

  }
}

export const trainRedirect = (data, history, uri) => {
    return async(dispatch, getState) => {
      let totalresp = await dispatch(train(data))
      if (totalresp.error) {
      //  // the last dispatched action has errored, break out of the promise chain.
        throw new Error("Promise flow received action error", totalresp);
       }
      return history.push(uri)
      
    }
}

export const getModelVersion = (params) =>{

  let url = setParams(ENDPOINT,params)
  return {
  [RSAA]:{
   endpoint: url,
      method: 'GET',
      body: '',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
       GET_MODELVERSION_REQUEST, GET_MODELVERSION_SUCCESS, GET_MODELVERSION_FAILURE
      ]

  }
}
}


