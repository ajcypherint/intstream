import { connect } from 'react-redux'
import Article from "../components/Article"
import * as reducers from '../reducers/'
import {getArticles, clearArticles} from '../actions/articles'

const API = '/api/articles/'

const mapStateToProps = (state) => {
  return { 
    articlesList:reducers.getArticles(state),
    articlesLoading:reducers.getArticleLoading(state),
    articlesErrors:reducers.getArticleErrors(state),
    articlesTotalCount:reducers.getArticleTotalCount(state),
 
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    fetchArticles: (params=undefined) => dispatch(getArticles(API,params)),

   }
}

export default connect(mapStateToProps, mapDispatchToProps)(Article);
