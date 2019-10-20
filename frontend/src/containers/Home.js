import React from 'react'
import { connect } from 'react-redux'
import * as reducers from '../reducers/'
import { Main} from '../components/Home'
import {getArticles,clearArticles} from '../actions/articles'

import {getSources, getAllSources, clearSources} from '../actions/sources'

const API = '/api/articles/'
const API_SOURCES = '/api/sources/'
const mapStateToProps = (state) => ({
    articlesList:reducers.getArticles(state),
    articlesLoading:reducers.getArticleLoading(state),
    articlesErrors:reducers.getArticleErrors(state),
    articlesTotalCount:reducers.getArticleTotalCount(state),
    articleNext:reducers.getArticleNextPage(state),
    articlePrevious:reducers.getArticlePreviousPage(state),
    sourcesList:reducers.getSources(state),
    sourcesTotalCount:reducers.getTotalCount(state),
    allSourcesLoaded:reducers.getAllLoaded(state)
})


const mapDispatchToProps = (dispatch) => ({
    fetchAllSources: (params = undefined) => dispatch(getAllSources(API_SOURCES, params)),
    fetchArticlesFullUri: (url,params=undefined) => dispatch(getArticles(url,params)),
    fetchArticles: (params=undefined) => dispatch(getArticles(API,params)),
    clearArticles:()=>dispatch(clearArticles())
})

export default connect(mapStateToProps, mapDispatchToProps)(Main);
