import { RSAA } from 'redux-api-middleware'
import { withAuth } from '../reducers/util'
import { setParams, getAll, JSONFORM } from './util'

export const GET_SOURCES_REQUEST = '@@sources/GET_SOURCES_REQUEST'
export const GET_SOURCES_SUCCESS = '@@sources/GET_SOURCES_SUCCESS'
export const GET_SOURCES_FAILURE = '@@sources/GET_SOURCES_FAILURE'

export const SET_SOURCES_REQUEST = '@@sources/SET_SOURCES_REQUEST'
export const SET_SOURCES_SUCCESS = '@@sources/SET_SOURCES_SUCCESS'
export const SET_SOURCES_FAILURE = '@@sources/SET_SOURCES_FAILURE'

export const SOURCE_FORM_UPDATE = '@@sources/SOURCE_FORM_UPDATE'

export const CLEAR = '@@sources/CLEAR'
export const GET_TOTAL_SOURCES = '@@sources/TOTAL'

export const clearSources = () => {
  return {
    type: CLEAR,
    payload: {}

  }
}
export const sourceFormUpdate = (data) => {
  return {
    type: SOURCE_FORM_UPDATE,
    payload: data

  }
}
export const totalSources = (data, total) => {
  return {
    type: GET_TOTAL_SOURCES,
    payload: { sources: data, totalCount: total }
  }
}
export const getSources = (url, params = undefined) => {
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
        GET_SOURCES_REQUEST, GET_SOURCES_SUCCESS, GET_SOURCES_FAILURE
      ]

    }
  }
}

export const setSources = (url, data, method = 'PUT', contentType = JSONFORM) => {
  // filters - list[string]
  if (contentType === JSONFORM) {
    return {
      [RSAA]: {
        endpoint: url,
        fetch: fetch,
        method: method,
        body: JSON.stringify(data),
        headers: withAuth({ 'Content-Type': contentType }),
        types: [
          SET_SOURCES_REQUEST, SET_SOURCES_SUCCESS, SET_SOURCES_FAILURE
        ]

      }
    }
  } else {
    const formdata = new FormData()
    for (const [key, value] of Object.entries(data)) {
      formdata.append(key, value)
    }
    // for key in data
    // data.append(key, value)
    return {
      [RSAA]: {
        endpoint: url,
        fetch: fetch,
        method: method,
        body: formdata,
        headers: withAuth({}),
        types: [
          SET_SOURCES_REQUEST, SET_SOURCES_SUCCESS, SET_SOURCES_FAILURE
        ]

      }
    }
  }
}

export const getAllSources = getAll(getSources)(totalSources)

export const addSources = (url, data, method, goBack, contentType = JSONFORM) => {
  return async (dispatch, getState) => {
    const totalresp = await dispatch(setSources(url, data, method, contentType))
    if (!totalresp.error) {
      goBack()
    }
  }
}
