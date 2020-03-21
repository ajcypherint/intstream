import React from 'react'
import { connect } from 'react-redux'
import * as reducers from '../reducers/'
import Main from '../components/TrainList'
import {getArticles, clearArticles, ARTICLE_URL} from '../actions/articles'
import * as fromSelect from '../actions/selectArticle'
import {getAllSources,getAllMLModels, setPage, setSelections, clear} from '../actions/trainFilter'
import {getSources, clearSources } from '../actions/sources'
import * as fromClassif from "../actions/classification"
import {filterChange} from "../actions/trainFilter"

const API_SOURCES = '/api/homefilter/'
const API_ARTICLES = ARTICLE_URL
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
  selectArticles:reducers.getSelectArticles(state),
  selectErrors:reducers.getSelectErrors(state),
  classif:reducers.getClassifications(state),
  classifErrors:reducers.getClassifErrors(state),
  classifCounts:reducers.getClassifCounts(state)
})


const mapDispatchToProps = (dispatch) => ({
  filterChange: (newSelections) => dispatch(filterChange(newSelections)),
  fetchAllSources: (params = undefined) => dispatch(getAllSources(API_SOURCES, params)),
  fetchAllMLModels: (params = undefined) => dispatch(getAllMLModels(API_MODELS, params)),
  fetchArticlesFullUri: (url,params=undefined) => dispatch(getArticles(url, params)),
  fetchArticles: (params=undefined) => dispatch(getArticles(API_ARTICLES, params)),
  clearArticles:()=>dispatch(clearArticles()),
  setSelections: (data)=>dispatch(setSelections(data)),
  setPage:(page)=>dispatch(setPage(page)),
  clear: ()=>dispatch(clear()),
  fetchSelect: (id)=>dispatch(fromSelect.getArticle(API_ARTICLES,id)),
  clearSelect: ()=>dispatch(fromSelect.clearArticles()),
  fetchArticlesAndClassif: (model,article_params)=>dispatch(
                            fromClassif.getArticlesAndClassif(model, article_params)),
  deleteClassification: (id, article_id, mlmodel)=>dispatch(
                          fromClassif.deleteClassificationLoadCounts(id, article_id, mlmodel)),
  setClassif: (mlmodel, articleId, target)=>
                dispatch(fromClassif.setClassificationLoadCounts(mlmodel, articleId, target)),
  fetchClassifCounts:(params) =>dispatch(fromClassif.getCounts(params)),
  clearClassif: ()=>dispatch(fromClassif.clear())
})

export default connect(mapStateToProps, mapDispatchToProps)(Main);
