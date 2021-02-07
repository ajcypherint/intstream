// reducers/articles.js
//
import _ from 'lodash'
import * as articlesData from '../actions/articles'
import URL from 'url-parse'
import { ASC, DESC } from '../util/util'

const START = new Date()
START.setHours(0, 0, 0, 0)

const END = new Date()
END.setHours(23, 59, 59, 999)

// use articlestmp to load pages and retrieve data
export const initialState = {
  articles: [],
  loading: false,
  totalcount: 0,
  errors: {},
  nextpage: null,
  previouspage: null,
  saving: false,
  parents: {}

}

function setArticle (stateEntry, state, parent = undefined) {
  if (typeof parent !== 'undefined') {
    const index = _.findIndex(state.articles, { id: parent })
    const parentEntry = state.articles[index]
    const articles = [...state.articles]
    articles.splice(index, 1,
      {
        ...parentEntry,
        children: stateEntry
      }
    )
    return {
      ...state,
      articles: articles
    }
  }
  return {
    ...state,
    ...stateEntry
  }
}
export default (state = initialState, action) => {
  switch (action.type) {
    // used for edit
    case articlesData.SET_ARTICLES_REQUEST:
    {
      const entry = {

        saving: true
      }
      return setArticle(entry, state, action.meta.parent)
    }
    case articlesData.SET_ARTICLES_SUCCESS:
    {
      const entry = {
        articles: [action.payload],
        saving: false
      }
      return setArticle(entry, state, action.meta.parent)
    }
    case articlesData.SET_ARTICLES_FAILURE:
    {
      const entry = {
        saving: false,
        errors: action.payload.response || { non_field_errors: action.payload.statusText }
      }
      return setArticle(entry, state, action.meta.parent)
    }
    // used for listing
    case articlesData.CLEAR:
    {
      const entry = {
        articles: [],
        loading: false,
        totalcount: 0,
        errors: {},
        nextpage: null,
        previouspage: null,
        saving: false
      }
      return setArticle(entry, state, action.meta.parent)
    }

    case articlesData.GET_ARTICLES_REQUEST:
    {
      const entry = {
        articles: [],
        loading: true,
        errors: {}
      }
      return setArticle(entry, state, action.meta.parent)
    }

    case articlesData.GET_ARTICLES_SUCCESS:
    {
      // let result = _.mapKeys(action.payload.results, 'id'); // maps id field from array to a property name
      // #let newarticlesourcesData= {...result}
      const entry = {
        articles: action.payload.results,
        totalcount: action.payload.count,
        loading: false,
        nextpage: action.payload.next,
        previouspage: action.payload.previous,
        errors: {}
      }
      return setArticle(entry, state, action.meta.parent)
    }
    case articlesData.GET_ARTICLES_FAILURE:
    {
      const entry = {
        articles: [],
        totalcount: 0,
        loading: false,
        nextpage: null,
        previouspage: null,
        errors: action.payload.response || { non_field_errors: action.payload.statusText }
      }
      return setArticle(entry, state, action.meta.parent)
    }
    default:
      return state
  }
}

export function totalcount (state) {
  return state.totalcount
}

export function articles (state) {
  if (state.articles) {
    return state.articles
  }
}

export function nextPage (state) {
  if (state.nextpage != null) {
    const fullUrl = new URL(state.nextpage)
    const path = fullUrl.pathname + fullUrl.query
    return path
  } else {
    return state.nextpage
  }
}

export function previousPage (state) {
  if (state.previouspage != null) {
    const fullUrl = new URL(state.previouspage)
    const path = fullUrl.pathname + fullUrl.query
    return path
  } else {
    return state.previouspage
  }
}

export function loading (state) {
  return state.loading
}
export function saving (state) {
  return state.saving
}

export function errors (state) {
  return state.errors
}
