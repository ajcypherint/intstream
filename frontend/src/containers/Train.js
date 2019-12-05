import React from 'react'
import { connect } from 'react-redux'
import * as reducers from '../reducers/'
import  Main from '../components/Train'
import {getArticle, } from '../actions/randomArticle'

const API = '/api/unclass/'
const mapStateToProps = (state) => ({
  articlesList:reducers.getRandomArticle(state),
  articlesLoading:reducers.getRandomLoading(state),
  articlesErrors:reducers.getRandomErrors(state),
})

const mapDispatchToProps = (dispatch) => ({
  fetchArticles: (model) => dispatch(getArticle(model)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Main);
