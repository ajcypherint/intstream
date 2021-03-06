import { RSAA } from 'redux-api-middleware'
import { withAuth } from '../reducers/util'
import _ from 'lodash'
import URL from 'url-parse'
import { setParams, getAll } from './util'
import { PAGINATION, dateString } from '../util/util'
import { getSources } from './sources'
import { getIndJobVersion } from './indJobVersion'

import { INDJOB_API } from '../containers/api'

export const ALL_JOBS = '@@indjobversionfilter/TOTALJOBS'

export const CLEAR = '@@indjobversionfilter/CLEAR'
export const HOME = '@@indjobversionfilter/HOME'
export const PAGE = '@@indjobversionfilter/PAGE'

export const GET_FILTER_REQUEST = '@@indjobversionfilter/GET_FILTER_REQUEST'
export const GET_FILTER_SUCCESS = '@@indjobversionfilter/GET_FILTER_SUCCESS'
export const GET_FILTER_FAILURE = '@@indjobversionfilter/GET_FILTER_FAILURE'
export const clear = () => {
  return {
    type: CLEAR
  }
}
export const totalJobs = (data) => {
  return {
    type: ALL_JOBS,
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

export const getAllJobs = getAll(getfilter)(totalJobs)

export const filterChange = (newSelections, setQuery) => {
  return async (dispatch, getState) => {
    const orderdir = newSelections.orderdir || ''
    const jobChosen = newSelections.jobChosen || ''
    setQuery(newSelections)
    const jobStr = 'ordering=version&id=' + jobChosen +
      '&active=true&indicatorjobversion__isnull=false'

    // fetch sources and jobs; * not just sources but all filters not inc dates *
    // could ignore this for child
    const resp = await dispatch(getAllJobs(INDJOB_API, jobStr))
    if (resp.error) {
      return
    }

    const mvStr = 'ordering=' + orderdir + newSelections.ordering +
      '&job=' + jobChosen +
      '&page=' + newSelections.page

    // todo(aj) if parents defined use ../action/childArticles; getChildArticles instead.
    await dispatch(getIndJobVersion(mvStr))
  }
}
