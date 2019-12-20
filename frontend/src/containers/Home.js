import React from 'react'
import { connect } from 'react-redux'
import * as reducers from '../reducers/'
import { Main} from '../components/Home'
import {getArticles, clearArticles} from '../actions/articles'
import {getChildArticles,clearParent} from '../actions/childArticles'
import {setPage, setHomeSelections, getAllSources} from '../actions/filter'
import {setChildPage, setChildHomeSelections} from '../actions/childFilter'
import {getSources, clearSources } from '../actions/sources'

const API = '/api/homearticles/'
const API_SOURCES = '/api/homefilter/'
const ARTICLE_URI = "/article/"
const mapStateToProps = (state) => ({
  sourcesList:reducers.getFilterSources(state),
  parent:{
    homeSelections:reducers.getHomeArticleSelections(state),
    articlesList:reducers.getArticles(state),
    articlesLoading:reducers.getArticleLoading(state),
    articlesErrors:reducers.getArticleErrors(state),
    articlesTotalCount:reducers.getArticleTotalCount(state),
    articleNext:reducers.getArticleNextPage(state),
    articlePrevious:reducers.getArticlePreviousPage(state),
    articleuri:ARTICLE_URI,
  },
  child:{
    parentTrail:reducers.getParentTrail(state),
    homeSelections:reducers.getChildHomeArticleSelections(state),
    articlesList:reducers.getChildArticles(state),
    articlesLoading:reducers.getChildArticleLoading(state),
    articlesErrors:reducers.getChildArticleErrors(state),
    articlesTotalCount:reducers.getChildArticleTotalCount(state),
    articleNext:reducers.getChildArticleNextPage(state),
    articlePrevious:reducers.getChildArticlePreviousPage(state),
    articleuri:ARTICLE_URI,
  }
})


const mapDispatchToProps = (dispatch) => ({
  fetchAllSources: (params = undefined) => dispatch(getAllSources(API_SOURCES, params)),
  parent_func:{
    fetchArticlesFullUri: (url,params=undefined) => dispatch(getArticles(url,params)),
    fetchArticles: (params=undefined) => dispatch(getArticles(API,params)),
    setHomeSelections: (data)=>dispatch(setHomeSelections(data)),
    setPage:(page)=>dispatch(setPage(page)),
  },
  child_func:{
    fetchArticlesFullUri: (parent, url,params=undefined) => dispatch(getChildArticles(parent, url,params)),
    fetchArticles: (parent,params=undefined) => dispatch(getChildArticles(parent, API,params)),
    setHomeSelections: (data)=>dispatch(setChildHomeSelections(data)),
    setPage:(page)=>dispatch(setChildPage(page)),
    clearParent:()=>dispatch(clearParent())
 
  }

})

export default connect(mapStateToProps, mapDispatchToProps)(Main);
