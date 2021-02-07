import { RSAA } from 'redux-api-middleware'
import { withAuth } from '../reducers/util'
import _ from 'lodash'
import URL from 'url-parse'
import { setParams, getAll } from './util'
import { PAGINATION, dateString } from '../util/util'
import { getSources } from './sources'
import { getModelVersion } from './modelVersion'

export const ALL_MLMODELS = '@@modelversionfilter/TOTALMLMODELS'

export const CLEAR = '@@modelversionfilter/CLEAR'
export const HOME = '@@modelversionfilter/HOME'
export const PAGE = '@@modelversionfilter/PAGE'

export const GET_FILTER_REQUEST = '@@modelversionfilter/GET_FILTER_REQUEST'
export const GET_FILTER_SUCCESS = '@@modelversionfilter/GET_FILTER_SUCCESS'
export const GET_FILTER_FAILURE = '@@modelversionfilter/GET_FILTER_FAILURE'
export const MODEL_API = '/api/mlmodels'
export const clear = () => {
  return {
    type: CLEAR
  }
}
export const totalMLModels = (data) => {
  return {
    type: ALL_MLMODELS,
    payload: data
  }
}
export const getfilter = (url, params = undefined) => {
  // filters - list[string]
  url = setParams(url, params)
  return {
    [RSAA]: {
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

export const getAllMLModels = getAll(getfilter)(totalMLModels)

export const filterChange = (newSelections, setQuery) => {
  return async (dispatch, getState) => {
    const orderdir = newSelections.orderdir || ''
    const mlmodelChosen = newSelections.mlmodelChosen || ''
    setQuery(newSelections)
    const modelStr = 'ordering=name&id=' + mlmodelChosen +
      '&active=true&modelversion__isnull=false'

    // fetch sources and models; * not just sources but all filters not inc dates *
    // could ignore this for child
    const resp = await dispatch(getAllMLModels(MODEL_API, modelStr))
    if (resp.error) {
      return
    }

    const mvStr = 'ordering=' + orderdir + newSelections.ordering +
      '&model=' + mlmodelChosen +
      '&page=' + newSelections.page +
      '&model__active=true'

    // todo(aj) if parents defined use ../action/childArticles; getChildArticles instead.
    return await dispatch(getModelVersion(mvStr))
  }
}
