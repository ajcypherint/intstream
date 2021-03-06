import { RSAA } from 'redux-api-middleware'
import { withAuth } from '../reducers/util'
import _ from 'lodash'
import URL from 'url-parse'
import { setParams, getAll } from './util'
import { PAGINATION } from '../util/util'

export const HOME = '@@childfilter/HOME'
export const PAGE = '@@childfilter/PAGE'

export const GET_FILTER_REQUEST = '@@childfilter/GET_FILTER_REQUEST'
export const GET_FILTER_SUCCESS = '@@childfilter/GET_FILTER_SUCCESS'
export const GET_FILTER_FAILURE = '@@childfilter/GET_FILTER_FAILURE'

export const setChildPage = (data) => {
  return {
    type: PAGE,
    payload: data
  }
}
export const setChildHomeSelections = (data) => {
  return {
    type: HOME,
    payload: data
  }
}

export const getChildFilter = (url, params = undefined) => {
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
