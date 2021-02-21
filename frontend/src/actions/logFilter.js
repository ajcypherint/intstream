import { RSAA } from 'redux-api-middleware'
import { withAuth } from '../reducers/util'
import { setParams, getAll } from './util'
import { dateString } from '../util/util'
import { getArticles } from './articles'
import { JOB_LOGS_API } from '../containers/api'

export const CLEAR = '@@logfilter/CLEAR'
export const HOME = '@@logfilter/HOME'
export const PAGE = '@@logfilter/PAGE'

export const GET_FILTER_REQUEST = '@@logfilter/GET_FILTER_REQUEST'
export const GET_FILTER_SUCCESS = '@@logfilter/GET_FILTER_SUCCESS'
export const GET_FILTER_FAILURE = '@@logfilter/GET_FILTER_FAILURE'

export const clear = () => {
  return {
    type: CLEAR
  }
}

export const getfilter = (url, params = undefined) => {
  // filters - list[string]
  url = setParams(url, params)
  return {
    [RSAA]: {
      endpoint: url,
      fetch: fetch,
      method: 'GET',
      body: '',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        GET_FILTER_REQUEST, GET_FILTER_SUCCESS, GET_FILTER_FAILURE
      ]
    }
  }
}

export const filterChange = (newSelections, setQuery) => {
  return async (dispatch, getState) => {
    const job = newSelections.job
    const orderdir = newSelections.orderdir || ''
    const ordering = newSelections.ordering || ''
    const page = newSelections.page || 1

    setQuery(newSelections)

    const articleStr = 'ordering=' + orderdir +
        ordering +
        '&page=' + page +
        '&job=' + job

    // todo(aj) if parents defined use ../action/childArticles; getChildArticles instead.
    await dispatch(getArticles(JOB_LOGS_API, articleStr))
  }
}
