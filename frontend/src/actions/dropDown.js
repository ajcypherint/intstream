import { RSAA } from 'redux-api-middleware'
import { withAuth } from '../reducers/util'
import { setParams, getAll, JSONFORM } from './util'

export const GET_DROPDOWN_REQUEST = '@@dropdown/GET_DROPDOWN_REQUEST'
export const GET_DROPDOWN_SUCCESS = '@@dropdown/GET_DROPDOWN_SUCCESS'
export const GET_DROPDOWN_FAILURE = '@@dropdown/GET_DROPDOWN_FAILURE'

export const CLEAR = '@@dropdown/CLEAR'
export const GET_TOTAL_DROPDOWN = '@@dropdown/TOTAL'

export const clearDropDown = (key) => {
  return {
    type: CLEAR,
    meta: key,
    payload: {}

  }
}

export const getDropDown = (url, params, key) => {
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
        {
          type: GET_DROPDOWN_REQUEST,
          meta: { key: key }
        },
        {
          type: GET_DROPDOWN_SUCCESS,
          meta: { key: key }
        },
        {
          type: GET_DROPDOWN_FAILURE,
          meta: { key: key }
        }
      ]

    }
  }
}
export const totalDropDown = (data, total, key) => {
  return {
    type: GET_TOTAL_DROPDOWN,
    payload: { sources: data, totalCount: total },
    meta: key
  }
}
export const getAllDropDown = getAll(getDropDown)(totalDropDown)
