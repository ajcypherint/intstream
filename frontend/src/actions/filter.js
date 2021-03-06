import { RSAA } from 'redux-api-middleware'
import { withAuth } from '../reducers/util'
import _ from 'lodash'
import URL from 'url-parse'
import { setParams, getAll } from './util'
import { PAGINATION, dateString } from '../util/util'
import { getSources } from './sources'
import { getArticles, clearArticles, ARTICLE_URL } from '../actions/articles'
import {
  getColNumericName,
  getColTextName,
  getColText,
  getColNumeric
} from '../actions/indicatorColumns'
import {
  getIPV4, getMD5, getSHA1, getSHA256,
  getIPV6, getEMAIL, getNETLOC,
  getIndicators, clearIndicators,
  getIndicatorsHome
} from '../actions/indicators'
import { setChildHomeSelections } from '../actions/childFilter'
import { getChildArticles } from '../actions/childArticles'

import {
  API_HOME_ARTICLES,
  API_ARTICLES,
  API_FILTER,
  MODEL_VERSIONS,
  INDICATOR_URL,
  INDICATOR_HOME_URL,
  INDICATOR_PARTIAL
} from '../containers/api'

export const ALL_SOURCES = '@@filter/TOTAL'
export const ALL_ACTIVE_MODELS = '@@filter/ALL_ACTIVE_MODELS'
export const HOME = '@@filter/HOME'
export const PAGE = '@@filter/PAGE'

export const GET_FILTER_REQUEST = '@@filter/GET_FILTER_REQUEST'
export const GET_FILTER_SUCCESS = '@@filter/GET_FILTER_SUCCESS'
export const GET_FILTER_FAILURE = '@@filter/GET_FILTER_FAILURE'

export const MAP_IND = {
  email: 'Email',
  ipv4: 'IPV4',
  ipv6: 'IPV6',
  netloc: 'NetLoc',
  sha256: 'Sha256',
  sha1: 'Sha1',
  md5: 'MD5'
}
export const setPage = (data) => {
  return {
    type: PAGE,
    payload: data
  }
}
export const setHomeSelections = (data) => {
  return {
    type: HOME,
    payload: data
  }
}
export const totalSources = (data) => {
  return {
    type: ALL_SOURCES,
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

export const getAllSources = getAll(getfilter)(totalSources)

function intersect (selectedCols, allColsObjs) {
  let cols = selectedCols || []
  const ColsList = []
  let i
  for (i = 0; i < allColsObjs.length; i++) {
    ColsList.push(allColsObjs[i].name)
  }
  cols = _.intersection(cols, ColsList)
  return cols
}

export const filterIndChange = (selections,
  setQuery,
  tabsUpdate
) => {
  return async (dispatch, getState) => {
    let indicatorStr
    const modelChosen = selections.modelChosen || ''
    const sourceChosen = selections.sourceChosen || ''
    const orderdir = selections.orderdir || ''
    const article = selections.article || ''
    selections.startDate.setHours(0, 0, 0, 0)
    selections.endDate.setHours(23, 59, 59, 999)
    selections = {
      ...selections,
      modelChosen: modelChosen,
      sourceChosen: sourceChosen,
      orderdir: orderdir
    }

    setQuery(selections)

    // set query string
    // if article view then just search by article
    if (article !== '') {
      const articleStr = 'id=' + article
      dispatch(getArticles(API_ARTICLES, articleStr))
      indicatorStr = 'ordering=' + orderdir + selections.ordering +
        '&orderdir=' + orderdir +
        '&article=' + selections.article
    } else {
      const predictionStr = modelChosen !== ''
        ? '&prediction__mlmodel=' + modelChosen + '&prediction__target=true'
        : ''

      const sourceStr = 'start_upload_date=' + selections.startDate.toISOString() +
        '&end_upload_date=' + selections.endDate.toISOString() +
        '&source=' + sourceChosen + predictionStr

      // fetch sources and models; * not just sources but all filters not inc dates *
      // could ignore this for child
      dispatch(getAllSources(API_FILTER, sourceStr))
      indicatorStr = 'ordering=' + orderdir + selections.ordering +
        '&orderdir=' + orderdir +
        '&source=' + sourceChosen +
        '&start_upload_date=' + selections.startDate.toISOString() +
        '&end_upload_date=' + selections.endDate.toISOString() + predictionStr
    }
    const indicatorStrPage = indicatorStr + '&page=' + selections.page
    // get counts for each indicator tab
    const resp_ind = await dispatch(getIndicatorsHome(INDICATOR_HOME_URL,
      selections.selectedTabIndex, indicatorStrPage))
    if (resp_ind.error) {
      return
    }
    // get indicators retrieved for filter
    const indicators = resp_ind.payload.results
    const ids = []
    for (let i = 0; i < indicators.length; i++) {
      ids.push(indicators[i].id)
    }
    const indInStr = 'indicator__in=' + ids.join(',')
    // get columns available to choose from
    const ind_type = MAP_IND[selections.selectedTabIndex]
    let param_cols
    if (typeof selections.article !== 'undefined') {
      param_cols = 'article=' + selections.article + '&ind_type=' + ind_type
    } else {
      param_cols = 'start_upload_date=' + selections.startDate.toISOString() +
      '&end_upload_date=' + selections.endDate.toISOString() +
      '&ind_type=' + ind_type +
      '&source=' + sourceChosen + '&model=' + modelChosen
    }
    dispatch(getColTextName(param_cols))
    dispatch(getColNumericName(param_cols))
    if (tabsUpdate) {
      dispatch(getIPV4(indicatorStr))
      dispatch(getIPV6(indicatorStr))
      dispatch(getEMAIL(indicatorStr))
      dispatch(getNETLOC(indicatorStr))
      dispatch(getMD5(indicatorStr))
      dispatch(getSHA1(indicatorStr))
      dispatch(getSHA256(indicatorStr))
      dispatch(getColText(indInStr))
      dispatch(getColNumeric(indInStr))
    }
  }
}

// todo(aj) add active filter
export const filterChange = (selections, setQuery, parent) => {
  return async (dispatch, getState) => {
    const modelChosen = selections.modelChosen || ''
    const sourceChosen = selections.sourceChosen || ''
    const orderdir = selections.orderdir || ''
    selections.startDate.setHours(0, 0, 0, 0)
    selections.endDate.setHours(23, 59, 59, 999)

    selections = {
      ...selections,
      modelChosen: modelChosen,
      sourceChosen: sourceChosen,
      orderdir: orderdir
    }
    setQuery(selections)
    const predictionStr = modelChosen !== ''
      ? '&prediction__mlmodel=' + modelChosen + '&prediction__target=true'
      : ''
    const sourceStr = 'start_upload_date=' + selections.startDate.toISOString() +
      '&end_upload_date=' + selections.endDate.toISOString() +
      '&source=' + sourceChosen +
      predictionStr

    // fetch sources and models; * not just sources but all filters not inc dates *
    // could ignore this for child
    if (!parent) {
      const resp = dispatch(getAllSources(API_FILTER, sourceStr))
      if (resp.error) {
        return
      }
    }
    const pageSel = parent ? parseInt(selections.child.page) : selections.page
    let articleStr = dateString(orderdir,
      selections.ordering,
      sourceChosen,
      pageSel,
      selections.startDate,
      selections.endDate,
      selections.threshold) +
      (selections.maxDf ? '&max_df=' + selections.maxDf : '') +
      (selections.MinDf ? '&min_df=' + selections.minDf : '') + predictionStr

    if (parent) {
      const { id, title, match } = parent
      for (const x of match) {
        articleStr += '&article_id_multi=' + x
      }
    }
    const test = articleStr
    // todo(aj) if parents defined use ../action/childArticles; getChildArticles instead.
    if (parent) {
      dispatch(getArticles(API_ARTICLES, articleStr, parent.id))
    } else {
      dispatch(getArticles(API_HOME_ARTICLES, articleStr))
    }
  }
}
