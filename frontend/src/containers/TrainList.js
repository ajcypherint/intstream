import React from 'react'
import { connect } from 'react-redux'
import * as reducers from '../reducers/'
import { Main} from '../components/Home'
import {getArticles, clearArticles} from '../actions/articles'
import {getAllSources} from '../actions/filter'
import {getSources, clearSources } from '../actions/sources'

const API_SOURCES = '/api/homefilter/'
const API_ARTICLE = '/api/articles/'
const ARTICLE_URI = "/article/"
const mapStateToProps = (state) => ({
  sourcesList:reducers.getFilterSources(state),
})


const mapDispatchToProps = (dispatch) => ({
  fetchAllSources: (params = undefined) => dispatch(getAllSources(API_SOURCES, params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Main);
