import React from 'react'
import { connect } from 'react-redux'
import * as reducers from '../reducers/'
import { Main} from '../components/Home'
import {getArticles, clearArticles, ARTICLE_URL} from '../actions/articles'
import {getChildArticles,clearParent} from '../actions/childArticles'
import {filterChange, setPage, setHomeSelections, getAllSources, MODEL_VERSIONS, getAllActiveModels} from '../actions/filter'
import {getSources, clearSources } from '../actions/sources'
import * as fromSelect from '../actions/selectArticle'
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
} from 'use-query-params';


const API = '/api/homearticles/'
const API_SOURCES = '/api/homefilter/'
const API_ARTICLE = ARTICLE_URL
const ARTICLE_URI = "/article/"
const mapStateToProps = (state) => ({
  sourcesList:reducers.getFilterSources(state),
  selectArticles:reducers.getSelectArticles(state),
  selectErrors:reducers.getSelectErrors(state),
  articlesList:reducers.getArticles(state),
  articlesLoading:reducers.getArticleLoading(state),
  articlesErrors:reducers.getArticleErrors(state),
  articlesTotalCount:reducers.getArticleTotalCount(state),
  articleNext:reducers.getArticleNextPage(state),
  articlePrevious:reducers.getArticlePreviousPage(state),
  articleuri:ARTICLE_URI,
  })


const mapDispatchToProps = (dispatch) => ({
  fetchAllSources: (params = undefined) => dispatch(getAllSources(API_SOURCES, params)),
  filterChange: (selections, setPage, parent=undefined ) => dispatch(filterChange(selections, setPage, parent)),
  //fetchAllActiveModels: (params = undefined) => dispatch(getAllActiveModels(MODEL_VERSIONS, params)),
  fetchSelect: (id)=>dispatch(fromSelect.getArticle(API_ARTICLE,id)),
  clearSelect: ()=>dispatch(fromSelect.clearArticles()),
  fetchArticlesFullUri: (url,params=undefined, parent=undefined) => dispatch(getArticles(url,params, parent)),
  fetchArticles: (params=undefined,parent=undefined) => dispatch(getArticles(API,params, parent)),
  clearParent:()=>dispatch(clearParent())

})

export default connect(mapStateToProps, mapDispatchToProps)(
 withQueryParams( 
  {
    ordering: StringParam,
    page: NumberParam,
    orderdir:StringParam,
    sourceChosen:StringParam,
    modelChosen:StringParam,
    startDate:DateParam,
    endDate:DateParam,
    threshold:NumberParam,
    minDf:NumberParam,
    maxDf:NumberParam,
    next:StringParam,
    previous:StringParam,
    parent_id:NumberParam,
    parentMatch:DelimitedNumericArrayParam,
    child:ObjectParam,
  },
 
  Main));
