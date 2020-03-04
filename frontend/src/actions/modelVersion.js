import { RSAA } from 'redux-api-middleware';
import { withAuth } from '../reducers'
import {setParams,getAll} from './util'

let TRAIN_ENDPOINT = '/api/train/'
let ENDPOINT = '/api/modelversion/'
export const GET_MODELVERSION_REQUEST = '@@modelVersion/GET_MODELVERSION_REQUEST';
export const GET_MODELVERSION_SUCCESS = '@@modelVersion/GET_MODELVERSION_SUCCESS';
export const GET_MODELVERSION_FAILURE = '@@modelVersion/GET_MODELVERSION_FAILURE';

export const TRAIN_MODELVERSION_REQUEST = '@@modelVersion/TRAIN_MODELVERSION_REQUEST';
export const TRAIN_MODELVERSION_SUCCESS = '@@modelVersion/TRAIN_MODELVERSION_SUCCESS';
export const TRAIN_MODELVERSION_FAILURE = '@@modelVersion/TRAIN_MODELVERSION_FAILURE';


export const train= (modelId, metric)=>{
  let data = {
              "mlmodel":modelId,
              "metric_name":metric,
              "script_directory":"uuid-original-default" //todo(aj) hardcoded for now
              }
  return {
  [RSAA]:{
   endpoint: TRAIN_ENDPOINT,
      method: 'POST',
      body: JSON.stringify(data),
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
       TRAIN_MODELVERSION_REQUEST, TRAIN_MODELVERSION_SUCCESS, TRAIN_MODELVERSION_FAILURE
      ]

  }

  }
}

export const trainRedirect = (data, history, uri, metric) => {
    return async(dispatch, getState) => {
      let totalresp = await dispatch(train(data, metric))
      if (totalresp.error) {
      //  // the last dispatched action has errored, break out of the promise chain.
        throw new Error("Promise flow received action error", totalresp);
       }
      return history.push("/versions")
      
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


