import { RSAA } from 'redux-api-middleware'
import { withAuth } from '../reducers/util'
import URL from 'url-parse'
import { setParams } from './util'
import { BASE_INDICATOR_API } from '../containers/api'

const setParamsType = function (url, type, params) {
  if (typeof type !== 'undefined') {
    url = url + type + '/'
  }
  if (typeof params !== 'undefined') {
    url += '?' + params
  }
  return url
}

export const INDICATOR_URL = '/api/indicator'

export const GET_INDICATORS_REQUEST = '@@indicators/GET_INDICATORS_REQUEST'
export const GET_INDICATORS_SUCCESS = '@@indicators/GET_INDICATORS_SUCCESS'
export const GET_INDICATORS_FAILURE = '@@indicators/GET_INDICATORS_FAILURE'

export const GET_INDICATOR_UPDATE_REQUEST = '@@indicators/GET_INDICATOR_UPDATE_REQUEST'
export const GET_INDICATOR_UPDATE_SUCCESS = '@@indicators/GET_INDICATOR_UPDATE_SUCCESS'
export const GET_INDICATOR_UPDATE_FAILURE = '@@indicators/GET_INDICATOR_UPDATE_FAILURE'

export const GET_IPV6_REQUEST = '@@indicators/GET_IPV6_REQUEST'
export const GET_IPV6_SUCCESS = '@@indicators/GET_IPV6_SUCCESS'
export const GET_IPV6_FAILURE = '@@indicators/GET_IPV6_FAILURE'

export const GET_EMAIL_REQUEST = '@@indicators/GET_EMAIL_REQUEST'
export const GET_EMAIL_SUCCESS = '@@indicators/GET_EMAIL_SUCCESS'
export const GET_EMAIL_FAILURE = '@@indicators/GET_EMAIL_FAILURE'

export const GET_NETLOC_REQUEST = '@@indicators/GET_NETLOC_REQUEST'
export const GET_NETLOC_SUCCESS = '@@indicators/GET_NETLOC_SUCCESS'
export const GET_NETLOC_FAILURE = '@@indicators/GET_NETLOC_FAILURE'

export const GET_MD5_REQUEST = '@@indicators/GET_MD5_REQUEST'
export const GET_MD5_SUCCESS = '@@indicators/GET_MD5_SUCCESS'
export const GET_MD5_FAILURE = '@@indicators/GET_MD5_FAILURE'

export const GET_SHA1_REQUEST = '@@indicators/GET_SHA1_REQUEST'
export const GET_SHA1_SUCCESS = '@@indicators/GET_SHA1_SUCCESS'
export const GET_SHA1_FAILURE = '@@indicators/GET_SHA1_FAILURE'

export const GET_SHA256_REQUEST = '@@indicators/GET_SHA256_REQUEST'
export const GET_SHA256_SUCCESS = '@@indicators/GET_SHA256_SUCCESS'
export const GET_SHA256_FAILURE = '@@indicators/GET_SHA256_FAILURE'

export const GET_IPV4_REQUEST = '@@indicators/GET_IPV4_REQUEST'
export const GET_IPV4_SUCCESS = '@@indicators/GET_IPV4_SUCCESS'
export const GET_IPV4_FAILURE = '@@indicators/GET_IPV4_FAILURE'

export const SET_INDICATORS_REQUEST = '@@indicators/SET_INDICATORS_REQUEST'
export const SET_INDICATORS_SUCCESS = '@@indicators/SET_INDICATORS_SUCCESS'
export const SET_INDICATORS_FAILURE = '@@indicators/SET_INDICATORS_FAILURE'

export const CLEAR = '@@indicators/CLEAR'
export const API_MD5 = '/api/indicatormd5/'
export const API_SHA1 = '/api/indicatorsha1/'
export const API_SHA256 = '/api/indicatorsha256/'

export const clearIndicators = (data) => {
  return {
    type: CLEAR,
    payload: data

  }
}

export const getIPV6 = (params) => {
  const url = setParams('/api/indicatoripv6/', params)
  return {
    [RSAA]: {
      endpoint: url,
      method: 'GET',
      fetch: fetch,
      body: '',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        GET_IPV6_REQUEST, GET_IPV6_SUCCESS, GET_IPV6_FAILURE
      ]

    }
  }
}

export const getEMAIL = (params) => {
  const url = setParams('/api/indicatoremail/', params)
  return {
    [RSAA]: {
      endpoint: url,
      method: 'GET',
      fetch: fetch,
      body: '',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        GET_EMAIL_REQUEST, GET_EMAIL_SUCCESS, GET_EMAIL_FAILURE
      ]

    }
  }
}

export const getNETLOC = (params) => {
  const url = setParams('/api/indicatornetloc/', params)
  return {
    [RSAA]: {
      endpoint: url,
      method: 'GET',
      fetch: fetch,
      body: '',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        GET_NETLOC_REQUEST, GET_NETLOC_SUCCESS, GET_NETLOC_FAILURE
      ]

    }
  }
}

export const getIPV4 = (params) => {
  const url = setParams('/api/indicatoripv4/', params)
  return {
    [RSAA]: {
      endpoint: url,
      method: 'GET',
      fetch: fetch,
      body: '',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        GET_IPV4_REQUEST, GET_IPV4_SUCCESS, GET_IPV4_FAILURE
      ]

    }
  }
}

export const getSHA1 = (params) => {
  const url = setParams('/api/indicatorsha1/', params)
  return {
    [RSAA]: {
      endpoint: url,
      method: 'GET',
      fetch: fetch,
      body: '',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        GET_SHA1_REQUEST, GET_SHA1_SUCCESS, GET_SHA1_FAILURE
      ]

    }
  }
}

export const getSHA256 = (params) => {
  const url = setParams('/api/indicatorsha256/', params)
  return {
    [RSAA]: {
      endpoint: url,
      method: 'GET',
      fetch: fetch,
      body: '',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        GET_SHA256_REQUEST, GET_SHA256_SUCCESS, GET_SHA256_FAILURE
      ]

    }
  }
}

export const getMD5 = (params) => {
  const url = setParams('/api/indicatormd5/', params)
  return {
    [RSAA]: {
      endpoint: url,
      method: 'GET',
      fetch: fetch,
      body: '',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        GET_MD5_REQUEST, GET_MD5_SUCCESS, GET_MD5_FAILURE
      ]

    }
  }
}
export const getIndicatorsTemplate = (REQUEST) => (SUCCESS) => (FAILURE
) => (url, type = undefined, params = undefined) => {
  // filters - list[string]
  url = setParamsType(url, type, params)

  return {
    [RSAA]: {
      endpoint: url,
      method: 'GET',
      fetch: fetch,
      body: '',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        REQUEST, SUCCESS, FAILURE
      ]

    }
  }
}

export const getIndicatorUpdate = (id) => {
  // filters - list[string]
  const url = BASE_INDICATOR_API + '?id=' + id

  return {
    [RSAA]: {
      endpoint: url,
      method: 'GET',
      fetch: fetch,
      body: '',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        GET_INDICATOR_UPDATE_REQUEST, GET_INDICATOR_UPDATE_SUCCESS, GET_INDICATOR_UPDATE_FAILURE
      ]

    }
  }
}
export const getIndicators = getIndicatorsTemplate(GET_INDICATORS_REQUEST)(GET_INDICATORS_SUCCESS)(GET_INDICATORS_FAILURE)

export const setIndicators = (url, data, method = 'PUT') => {
  // filters - list[string]
  return {
    [RSAA]: {
      endpoint: url,
      method: method,
      fetch: fetch,
      body: JSON.stringify(data),
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        { type: SET_INDICATORS_REQUEST, meta: { id: data.id } },
        { type: SET_INDICATORS_SUCCESS, meta: { id: data.id } },
        { type: SET_INDICATORS_FAILURE, meta: { id: data.id } }
      ]

    }
  }
}
