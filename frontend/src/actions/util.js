import { PAGINATION } from '../util/util'
import { RSAA } from 'redux-api-middleware'
import { withAuth } from '../reducers/util'

export const MULTIPARTFORM = 'multipart/form'
export const JSONFORM = 'application/json'

export const setParamsParent = function (url, params, parent) {
  url += '?article_match_id=' + parent
  if (typeof params !== 'undefined') {
    url += params
  }
  return url
}

export const setParams = function (url, params) {
  if (typeof params !== 'undefined') {
    url += '?' + params
  }
  return url
}
// todo move to util
export const setActiveRequestTemplate = (ENDP) => (REQUEST) => (SUCCESS) => (FAILURE) => (id, trueFalse) => {
  const url = ENDP + id + '/'
  return {
    [RSAA]: {
      endpoint: url,
      fetch: fetch,
      method: 'PATCH',
      body: JSON.stringify({
        active: trueFalse
      }),
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        REQUEST, SUCCESS, FAILURE
      ]

    }
  }
}

export const getAll = (get) => (putAll) => (url, params, key) => {
  return async (dispatch, getState) => {
    const extraParams = params || ''
    const totalresp = await dispatch(get(url, extraParams, key))
    if (totalresp.error) {
      //  // the last dispatched action has errored, break out of the promise chain.
      return
    }
    let allModels = []
    const total = totalresp.payload.count
    const pages = Math.ceil(total / PAGINATION)
    // ACTIVE, duh time for bed.
    // todo(aj) wrap in promise and dispatch all at once
    const promises = []
    for (let i = 1; i <= pages; i++) {
      promises.push(dispatch(get(url, extraParams + '&page=' + i, key)))
      // const actionResponse = await dispatch(get(url, extraParams + '&page=' + i, key))
    }
    const res = await Promise.all(promises)
    for (let i = 0; i < res.length; i++) {
      if (res[i].error) {
        return
      }
      allModels = allModels.concat(res[i].payload.results)
    }

    // OR resolve another asyncAction here directly and pass the previous received payload value as argument...
    // wrap in promise so async
    dispatch(putAll(allModels, total, key))
  }
}

// todo move to util
export const getVersionTemplate = (ENDP) => (REQUEST) => (SUCCESS) => (FAILURE) => (params, meta = null) => {
  const url = setParams(ENDP, params)
  return {
    [RSAA]: {
      endpoint: url,
      fetch: fetch,
      method: 'GET',
      body: '',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        {
          meta: meta,
          type: REQUEST
        },
        {
          meta: meta,
          type: SUCCESS
        },
        {
          meta: meta,
          type: FAILURE
        }
      ]
    }
  }
}

// todo create template function; job str is a param; funcs are params
export const setActiveVersionTemplate = (parent) => (getNoRedux) => (setActiveRequest) => (filterChange) => (current, id, selections, setQuery) => {
  return async (dispatch, getState) => {
    // get active
    const getResp = await dispatch(getNoRedux(parent + '=' + current + '&active=true'))
    const len = getResp.payload.results.length
    if (getResp.error) {
      return
    }
    // set currently active to false
    if (len > 0) {
      const updateResp = await dispatch(setActiveRequest(getResp.payload.results[0].id, false))
      if (updateResp.error) {
        return
      }
    }
    // set new active to true
    const updateResp = await dispatch(setActiveRequest(id, true))
    if (updateResp.error) {
      return
    }
    // update page
    await dispatch(filterChange(selections, setQuery))
  }
}
