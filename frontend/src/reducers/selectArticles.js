// reducers/articles.js
//
import _ from 'lodash';
import * as articlesData from '../actions/selectArticle';

const createArticleEntry = (id,data={},loading=true)=>{
  
  return {
    id:id,
    loading:loading,
    data:data
  }
}

const addArticle = (id, articleEntry,mapping)=>{
  let new_mapping = {
    ...mapping,
    [id]:{
      ...articleEntry
    }
  }
  return new_mapping
}

const removeArticle = (id, mapping) => {
  let new_mapping = {
    ...mapping
  }

  delete new_mapping[id]
  return new_mapping

}
// use articlestmp to load pages and retrieve data
const initialState ={
  articles:{},
  errors: {},
}


export default (state=initialState, action) => {
  switch(action.type) {
    case articlesData.GET_ARTICLES_REQUEST:
      {
        let entry = createArticleEntry(action.meta.id)
        let new_articles = addArticle(action.meta.id,
                               entry,
                               state.articles)
        return {
          articles:new_articles,
          errors:{}
        }
      }

    case articlesData.GET_ARTICLES_SUCCESS:
      {
        let entry = createArticleEntry(action.meta.id,
                                       action.payload.results[0],
                                       false)
        let new_articles= addArticle(action.meta.id,
                                   entry,
                                   state.articles)
        return {
          articles:new_articles,
          errors:{},
        }
      }
    case articlesData.GET_ARTICLES_FAILURE:
      {
        let new_articles= removeArticle(action.meta.id,state.articles)
        return {
          articles:new_articles,
          errors: action.payload.response || {'non_field_errors': action.payload.statusText},
        }
      }
     case articlesData.CLEAR:
      {
        return {
          ...initialState
        }

      }
     default:
       return state

  }
}

export function articles(state) {
  if (state.articles) {
    return  state.articles
  }
}

export function errors(state) {
  return  state.errors
}

