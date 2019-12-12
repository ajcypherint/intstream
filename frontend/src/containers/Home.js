import React from 'react'
import { connect } from 'react-redux'
import * as reducers from '../reducers/'
import { Main} from '../components/Home'
import {getArticles, clearArticles} from '../actions/articles'
import {getAll, clear} from '../actions/childArticles'
import {setPage, setHomeSelections, getAllSources} from '../actions/filter'
import {getSources, clearSources } from '../actions/sources'

const API = '/api/homearticles/'
const API_SOURCES = '/api/homefilter/'
const ARTICLE_URI = "/article/"
const mapStateToProps = (state) => ({
  homeSelections:reducers.getHomeArticleSelections(state),
  articlesList:reducers.getArticles(state),
  articlesLoading:reducers.getArticleLoading(state),
  articlesErrors:reducers.getArticleErrors(state),
  articlesTotalCount:reducers.getArticleTotalCount(state),
  articleNext:reducers.getArticleNextPage(state),
  articlePrevious:reducers.getArticlePreviousPage(state),
  sourcesList:reducers.getFilterSources(state),
  children:reducers.getChildArticles(state),
  articleuri:ARTICLE_URI,
})


const mapDispatchToProps = (dispatch) => ({
  fetchAllSources: (params = undefined) => dispatch(getAllSources(API_SOURCES, params)),
  fetchArticlesFullUri: (url,params=undefined) => dispatch(getArticles(url,params)),
  fetchArticles: (params=undefined) => dispatch(getArticles(API,params)),
  setHomeSelections: (data)=>dispatch(setHomeSelections(data)),
  setPage:(page)=>dispatch(setPage(page)),
  fetchChildren:(parent, params=undefined) =>dispatch(getAll(parent, ARTICLE_URI, params))

})

export default connect(mapStateToProps, mapDispatchToProps)(Main);
