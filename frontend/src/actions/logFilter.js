import { RSAA } from 'redux-api-middleware'
import { withAuth } from '../reducers/util'
import { setParams, getAll } from './util'
import { dateString } from '../util/util'
import { getArticles } from './articles'

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

export const filterChangeTask = (uri, newSelections, setQuery) => {
  return async (dispatch, getState) => {
    const orderdir = newSelections.orderdir || ''
    const ordering = newSelections.ordering || ''
    const page = newSelections.page || 1

    const START = new Date()
    START.setHours(0, 0, 0, 0)

    const END = new Date()
    END.setHours(23, 59, 59, 999)
    const startDate = newSelections.startDate || START
    startDate.setHours(0, 0, 0, 0)

    const endDate = newSelections.endDate || END
    endDate.setHours(23, 59, 59, 999)
    setQuery(newSelections)

    const articleStr = 'ordering=' + orderdir +
        ordering +
      '&start_date_done=' + newSelections.startDate.toISOString() +
      '&end_date_done=' + newSelections.endDate.toISOString() +
        '&page=' + page

    await dispatch(getArticles(uri, articleStr))
  }
}

export const filterChange = (uri, newSelections, setQuery) => {
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

    await dispatch(getArticles(uri, articleStr))
  }
}
