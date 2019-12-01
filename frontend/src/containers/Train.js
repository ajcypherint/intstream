import React from 'react'
import { connect } from 'react-redux'
import * as reducers from '../reducers/'
import  Main from '../components/Train'
import {getArticles, clearArticles} from '../actions/articles'

const API = '/api/unclass/'
const mapStateToProps = (state) => ({
  articlesList:reducers.getArticles(state),
  articlesLoading:reducers.getArticleLoading(state),
  articlesErrors:reducers.getArticleErrors(state),
})

const mapDispatchToProps = (dispatch) => ({
  fetchArticles: (params=undefined) => dispatch(getArticles(API,params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Main);
