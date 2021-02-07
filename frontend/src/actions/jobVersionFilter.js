import { RSAA } from 'redux-api-middleware'
import { withAuth } from '../reducers/util'
import _ from 'lodash'
import URL from 'url-parse'
import { setParams, getAll } from './util'
import { PAGINATION, dateString } from '../util/util'
import { getSources } from './sources'
import { getJobVersion } from './jobVersion'

export const ALL_JOBS = '@@jobversionfilter/TOTALJOBS'

export const CLEAR = '@@jobversionfilter/CLEAR'
export const HOME = '@@jobversionfilter/HOME'
export const PAGE = '@@jobversionfilter/PAGE'

export const GET_FILTER_REQUEST = '@@jobversionfilter/GET_FILTER_REQUEST'
export const GET_FILTER_SUCCESS = '@@jobversionfilter/GET_FILTER_SUCCESS'
export const GET_FILTER_FAILURE = '@@jobversionfilter/GET_FILTER_FAILURE'
export const JOB_API = '/api/job'
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
      '&active=true&jobversion__isnull=false'

    // fetch sources and jobs; * not just sources but all filters not inc dates *
    // could ignore this for child
    const resp = await dispatch(getAllJobs(JOB_API, jobStr))
    if (resp.error) {
      return
    }

    const mvStr = 'ordering=' + orderdir + newSelections.ordering +
      '&job=' + jobChosen +
      '&page=' + newSelections.page +
      '&job__active=true'

    // todo(aj) if parents defined use ../action/childArticles; getChildArticles instead.
    return await dispatch(getJobVersion(mvStr))
  }
}
