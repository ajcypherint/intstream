import { RSAA } from 'redux-api-middleware'
import { withAuth } from '../reducers/util'
import { setParams, getAll } from './util'
import { dateString } from '../util/util'
import { getArticlesClassif } from './classification'

export const ALL_SOURCES = '@@trainfilter/TOTALSOURCES'
export const ALL_MLMODELS = '@@trainfilter/TOTALMLMODELS'

export const CLEAR = '@@trainfilter/CLEAR'
export const HOME = '@@trainfilter/HOME'
export const PAGE = '@@trainfilter/PAGE'

export const GET_FILTER_REQUEST = '@@trainfilter/GET_FILTER_REQUEST'
export const GET_FILTER_SUCCESS = '@@trainfilter/GET_FILTER_SUCCESS'
export const GET_FILTER_FAILURE = '@@trainfilter/GET_FILTER_FAILURE'
export const CLASSIF_FILTER = '/api/classiffilter/'
export const clear = () => {
  return {
    type: CLEAR
  }
}

export const totalSources = (data) => {
  return {
    type: ALL_SOURCES,
    payload: data
  }
}
export const totalMLModels = (data) => {
  return {
    type: ALL_MLMODELS,
    payload: data
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
export const getAllSources = getAll(getfilter)(totalSources)

export const getAllMLModels = getAll(getfilter)(totalMLModels)

export const filterChange = (newSelections, setQuery) => {
  return async (dispatch, getState) => {
    const orderdir = newSelections.orderdir || ''
    const ordering = newSelections.ordering || ''
    const trueFalse = newSelections.trueFalse || ''
    const sourceChosen = newSelections.sourceChosen || ''
    const mlmodelChosen = newSelections.mlmodelChosen || ''
    const page = newSelections.page || 1
    newSelections.startDate.setHours(0, 0, 0, 0)
    newSelections.endDate.setHours(23, 59, 59, 999)

    setQuery(newSelections)
    const targetStr = trueFalse !== ''
      ? ('&classification__target=' + trueFalse +
          '&classification__mlmodel=' + mlmodelChosen)
      : ''

    const sourceStr = 'start_upload_date=' + newSelections.startDate.toISOString() +
      '&end_upload_date=' + newSelections.endDate.toISOString() +
      '&source=' + sourceChosen +
      '&source__active=true' + targetStr

    dispatch(getAllSources(CLASSIF_FILTER, sourceStr))

    const articleStr = (dateString(orderdir,
      ordering,
      sourceChosen,
      page,
      newSelections.startDate,
      newSelections.endDate,
      newSelections.threshold) +
      targetStr +
      '&source__active=true')

    // todo(aj) if parents defined use ../action/childArticles; getChildArticles instead.
    dispatch(getArticlesClassif(mlmodelChosen, articleStr))
  }
}
