import React from 'react'
import { connect } from 'react-redux'
import * as reducers from '../reducers/'
import { Main } from '../components/IndicatorHome'
import { getIndicators, setIndicators } from '../actions/indicators'
import { filterIndChange, setPage, setHomeSelections, getAllSources, MODEL_VERSIONS, getAllActiveModels } from '../actions/filter'
import { getSources, clearSources } from '../actions/sources'
import { mitigateDispatch } from '../actions/mitigate'
import { getMultiJobVersion } from '../actions/multiJobVersion'
import {
  UNMITIGATE,
  MITIGATE,
  UNMITIGATE_IND_JOB_VERSION_API,
  MITIGATE_IND_JOB_VERSION_API
} from './api'

import {
  withQueryParams,
  DelimitedNumericArrayParam,
  JsonParam,
  useQueryParams,
  StringParam,
  NumberParam,
  ArrayParam,
  ObjectParam,
  DateParam
} from 'use-query-params'

import { MD5, SHA1, SHA256, IPV4, EMAIL, IPV6, NETLOC } from '../reducers/tab'

const getMitigateJobVersionFunc = getMultiJobVersion(MITIGATE_IND_JOB_VERSION_API)
const getUnmitigateJobVersionFunc = getMultiJobVersion(UNMITIGATE_IND_JOB_VERSION_API)

const API_SOURCES = '/api/homefilter/'
const mapStateToProps = (state) => ({
  sourcesList: reducers.getFilterSources(state),

  articlesList: reducers.getArticles(state),
  articlesLoading: reducers.getArticleLoading(state),
  articlesErrors: reducers.getArticleErrors(state),

  indicatorsList: reducers.getIndicators(state),
  indicatorsLoading: reducers.getIndicatorLoading(state),
  indicatorsErrors: reducers.getIndicatorErrors(state),
  indicatorsTotalCount: reducers.getIndicatorTotalCount(state),
  indicatorsNext: reducers.getIndicatorNextPage(state),
  indicatorsPrevious: reducers.getIndicatorPreviousPage(state),

  md5: reducers.getInd(state, MD5),
  sha1: reducers.getInd(state, SHA1),
  sha256: reducers.getInd(state, SHA256),
  ipv4: reducers.getInd(state, IPV4),
  ipv6: reducers.getInd(state, IPV6),
  netloc: reducers.getInd(state, NETLOC),
  email: reducers.getInd(state, EMAIL),

  numCols: reducers.getIndicatorColNum(state),
  textCols: reducers.getIndicatorColText(state),
  indicatorColTextErrors: reducers.getIndicatorColTextErrors(state),
  indicatorColNumErrors: reducers.getIndicatorColNumErrors(state),

  numColsData: reducers.getIndicatorColNumData(state),
  textColsData: reducers.getIndicatorColTextData(state),
  indicatorColTextDataErrors: reducers.getIndicatorColTextDataErrors(state),
  indicatorColNumDataErrors: reducers.getIndicatorColNumDataErrors(state),

  versions: reducers.getMultiJobVersion(state)
})

const mapDispatchToProps = (dispatch) => ({
  fetchMitigateJobVersions: (params = undefined) => dispatch(getMitigateJobVersionFunc(params, MITIGATE)),
  fetchUnMitigateJobVersions: (params = undefined) => dispatch(getUnmitigateJobVersionFunc(params, UNMITIGATE)),
  fetchAllSources: (params = undefined) => dispatch(getAllSources(API_SOURCES, params)),
  filterChange: (selections, setPage) => dispatch(filterIndChange(selections, setPage)),
  fetchIndicatorsFullUri: (url, params = undefined) => dispatch(getIndicators(url, undefined, params)),
  mitigateDispatch: (indicator) => dispatch(mitigateDispatch(indicator)),
  setIndicator: (url, indicatorObj) => dispatch(setIndicators(url, indicatorObj))
})

export default connect(mapStateToProps, mapDispatchToProps)(
  withQueryParams(
    {
      article: StringParam,
      ordering: StringParam,
      page: NumberParam,
      orderdir: StringParam,
      sourceChosen: StringParam,
      modelChosen: StringParam,
      startDate: DateParam,
      endDate: DateParam,
      next: StringParam,
      previous: StringParam,
      selectedTabIndex: StringParam,
      selectedTabIndexNum: NumberParam,
      numCols: ArrayParam,
      textCols: ArrayParam
    },

    Main))
