import React from 'react'
import { connect } from 'react-redux'
import * as reducers from '../reducers/'
import { Main} from '../components/IndicatorHome'
import {getIndicators} from '../actions/indicators'
import {filterIndChange, setPage, setHomeSelections, getAllSources, MODEL_VERSIONS, getAllActiveModels} from '../actions/filter'
import {getSources, clearSources } from '../actions/sources'
import {
  withQueryParams,
  DelimitedNumericArrayParam,
  JsonParam,
  useQueryParams,
  StringParam,
  NumberParam,
  ArrayParam,
  ObjectParam,
  DateParam,
} from 'use-query-params';


const API_SOURCES = '/api/homefilter/'
const mapStateToProps = (state) => ({
  sourcesList:reducers.getFilterSources(state),

  articlesList:reducers.getArticles(state),
  articlesLoading:reducers.getArticleLoading(state),
  articlesErrors:reducers.getArticleErrors(state),
 
  indicatorsList:reducers.getIndicators(state),
  indicatorsLoading:reducers.getIndicatorLoading(state),
  indicatorsErrors:reducers.getIndicatorErrors(state),
  indicatorsTotalCount:reducers.getIndicatorTotalCount(state),
  indicatorsNext:reducers.getIndicatorNextPage(state),
  indicatorsPrevious:reducers.getIndicatorPreviousPage(state),

  md5:reducers.getMD5(state),
  sha1:reducers.getSHA1(state),
  sha256:reducers.getSHA256(state),
  ipv4:reducers.getIPV4(state),
  netloc:reducers.getNETLOC(state),
  email:reducers.getEMAIL(state),
  ipv6:reducers.getIPV6(state),

  numCols:reducers.getIndicatorColNum(state),
  textCols:reducers.getIndicatorColText(state),
  indicatorColTextErrors:reducers.getIndicatorColTextErrors(state),
  indicatorColNumErrors:reducers.getIndicatorColNumErrors(state),

  numColsData:reducers.getIndicatorColNumData(state),
  textColsData:reducers.getIndicatorColTextData(state),
  indicatorColTextDataErrors:reducers.getIndicatorColTextDataErrors(state),
  indicatorColNumDataErrors:reducers.getIndicatorColNumDataErrors(state)

})


const mapDispatchToProps = (dispatch) => ({
  fetchAllSources: (params = undefined) => dispatch(getAllSources(API_SOURCES, params)),
  filterChange: (selections, setPage ) => dispatch(filterIndChange(selections, setPage, )),
  fetchIndicatorsFullUri: (url,  params=undefined) => dispatch(getIndicators(url, undefined, params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(
 withQueryParams( 
  {
    article: StringParam,
    ordering: StringParam,
    page: NumberParam,
    orderdir:StringParam,
    sourceChosen:StringParam,
    modelChosen:StringParam,
    startDate:DateParam,
    endDate:DateParam,
    next:StringParam,
    previous:StringParam,
    selectedTabIndex:StringParam,
    selectedTabIndexNum:NumberParam,
    numCols:ArrayParam,
    textCols:ArrayParam
  },
 
  Main));
