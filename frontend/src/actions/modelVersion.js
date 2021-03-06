import { RSAA } from 'redux-api-middleware'
import { withAuth } from '../reducers/util'
import { setParams, getAll } from './util'
import { filterChange } from './modelVersionFilter'

const TRAIN_ENDPOINT = '/api/train/'
const ENDPOINT = '/api/modelversion/'

export const GETNO_MODELVERSION_REQUEST = '@@modelVersion/GETNO_MODELVERSION_REQUEST'
export const GETNO_MODELVERSION_SUCCESS = '@@modelVersion/GETNO_MODELVERSION_SUCCESS'
export const GETNO_MODELVERSION_FAILURE = '@@modelVersion/GETNO_MODELVERSION_FAILURE'

export const GET_MODELVERSION_REQUEST = '@@modelVersion/GET_MODELVERSION_REQUEST'
export const GET_MODELVERSION_SUCCESS = '@@modelVersion/GET_MODELVERSION_SUCCESS'
export const GET_MODELVERSION_FAILURE = '@@modelVersion/GET_MODELVERSION_FAILURE'

export const UPDATE_MODELVERSION_REQUEST = '@@modelVersion/UPDATE_MODELVERSION_REQUEST'
export const UPDATE_MODELVERSION_SUCCESS = '@@modelVersion/UPDATE_MODELVERSION_SUCCESS'
export const UPDATE_MODELVERSION_FAILURE = '@@modelVersion/UPDATE_MODELVERSION_FAILURE'

export const TRAIN_MODELVERSION_REQUEST = '@@modelVersion/MODELVERSION_REQUEST'
export const TRAIN_MODELVERSION_SUCCESS = '@@modelVersion/MODELVERSION_SUCCESS'
export const TRAIN_MODELVERSION_FAILURE = '@@modelVersion/MODELVERSION_FAILURE'
export const PAGE = '@@modelVersion/MODELVERSION_PAGE'

export const setPage = (data) => {
  return {
    type: PAGE,
    payload: data
  }
}
export const train = (modelId, metric, extra_kwargs) => {
  const data = {
    mlmodel: modelId,
    extra_kwargs: extra_kwargs,
    metric_name: metric,
    script_directory: 'uuid-original-default' // todo(aj) hardcoded for now
  }
  return {
    [RSAA]: {
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

export const trainRedirect = (data, history, uri, metric, extra) => {
  return async (dispatch, getState) => {
    const totalresp = await dispatch(train(data, metric, extra))
    if (totalresp.error) {
      //  // the last dispatched action has errored, break out of the promise chain.
      return
    }
    return history.push('/versions')
  }
}
export const getModelVersionTemplate = (REQUEST) => (SUCCESS) => (FAILURE) => (params) => {
  const url = setParams(ENDPOINT, params)
  return {
    [RSAA]: {
      endpoint: url,
      fetch: fetch,
      method: 'GET',
      body: '',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        REQUEST, SUCCESS, FAILURE
      ]
    }
  }
}

export const getModelVersionNoRedux = getModelVersionTemplate(GETNO_MODELVERSION_REQUEST)(
  GETNO_MODELVERSION_SUCCESS)(
  GETNO_MODELVERSION_FAILURE)

export const getModelVersion = getModelVersionTemplate(GET_MODELVERSION_REQUEST)(
  GET_MODELVERSION_SUCCESS)(
  GET_MODELVERSION_FAILURE)

export const setActiveRequest = (id, trueFalse) => {
  const url = ENDPOINT + id + '/'
  return {
    [RSAA]: {
      endpoint: url,
      fetch: fetch,
      method: 'PATCH',
      body: JSON.stringify({
        active: trueFalse
      }),
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        UPDATE_MODELVERSION_REQUEST, UPDATE_MODELVERSION_SUCCESS, UPDATE_MODELVERSION_FAILURE
      ]

    }
  }
}

export const setActiveVersion = (model, id, selections, setQuery) => {
  return async (dispatch, getState) => {
    // get active
    const getResp = await dispatch(getModelVersionNoRedux('model=' + model + '&active=true'))
    const len = getResp.payload.results.length
    if (getResp.error) {
      return
    }
    if (len > 0) {
      const updateResp = await dispatch(setActiveRequest(getResp.payload.results[0].id, false))
      if (updateResp.error) {
        return
      }
    }
    const updateResp = await dispatch(setActiveRequest(id, true))
    if (updateResp.error) {
      return
    }
    await dispatch(filterChange(selections, setQuery))
  }
}
