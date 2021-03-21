import { RSAA } from 'redux-api-middleware'
import { withAuth } from '../reducers/util'
import _ from 'lodash'
import URL from 'url-parse'
import { setParams, getAll } from './util'
import { PAGINATION, dateString } from '../util/util'
import { getSources } from './sources'
import { getJobVersion } from './jobVersion'
import { JOB_API } from '../containers/api'

export const ALL_JOBS = '@@jobversionfilter/TOTALJOBS'

export const CLEAR = '@@jobversionfilter/CLEAR'
export const HOME = '@@jobversionfilter/HOME'
export const PAGE = '@@jobversionfilter/PAGE'

export const GET_FILTER_REQUEST = '@@jobversionfilter/GET_FILTER_REQUEST'
export const GET_FILTER_SUCCESS = '@@jobversionfilter/GET_FILTER_SUCCESS'
export const GET_FILTER_FAILURE = '@@jobversionfilter/GET_FILTER_FAILURE'
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

export const filterChangeTemplate = (parentField) => (newSelections, setQuery) => {
  return async (dispatch, getState) => {
    const orderdir = newSelections.orderdir || ''
    const jobChosen = newSelections.jobChosen || ''
    setQuery(newSelections)

    const mvStr = 'ordering=' + orderdir + newSelections.ordering +
      '&' + parentField + '=' + jobChosen +
      '&page=' + newSelections.page

    // todo(aj) if parents defined use ../action/childArticles; getChildArticles instead.
    return await dispatch(getJobVersion(mvStr))
  }
}

export const filterChange = filterChangeTemplate('job')
export const filterChangeTrain = filterChangeTemplate('script')
