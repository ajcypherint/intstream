import React from 'react'
import { connect } from 'react-redux'
import * as reducers from '../reducers/'
import Main from '../components/TrainList'
import {getArticles, clearArticles} from '../actions/articles'
import {getAllSources,getAllMLModels, setPage, setSelections, clear} from '../actions/trainFilter'
import {getSources, clearSources } from '../actions/sources'

const API_SOURCES = '/api/homefilter/'
const API_ARTICLES = '/api/articles/'
const API_MODELS = '/api/mlmodels/'
const ARTICLE_URI = "/article/"
const mapStateToProps = (state) => ({
  test:"test",
  sourcesList:reducers.getTrainFilterSources(state),
  modelsList:reducers.getTrainFilterMLModels(state),
  selections:reducers.getTrainSelections(state),
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
  fetchAllMLModels: (params = undefined) => dispatch(getAllMLModels(API_MODELS, params)),
  fetchArticlesFullUri: (url,params=undefined) => dispatch(getArticles(url, params)),
  fetchArticles: (params=undefined) => dispatch(getArticles(API_ARTICLES, params)),
  clearArticles:()=>dispatch(clearArticles()),
  setSelections: (data)=>dispatch(setSelections(data)),
  setPage:(page)=>dispatch(setPage(page)),
  clear: ()=>dispatch(clear())
})

export default connect(mapStateToProps, mapDispatchToProps)(Main);
