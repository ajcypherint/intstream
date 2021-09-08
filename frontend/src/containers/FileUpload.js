import { connect } from 'react-redux'
import FileUpload from '../components/FileUpload'
import * as reducers from '../reducers/'
import { getArticles, clearArticles } from '../actions/articles'

import { API_ARTICLES } from './api'

const mapStateToProps = (state) => {
  return {
    articlesList: reducers.getArticles(state),
    articlesLoading: reducers.getArticleLoading(state),
    articlesErrors: reducers.getArticleErrors(state),
    articlesTotalCount: reducers.getArticleTotalCount(state)

  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    fetchArticles: (params = undefined) => dispatch(getArticles(API_ARTICLES, params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FileUpload)
