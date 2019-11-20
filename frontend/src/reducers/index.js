import { combineReducers } from 'redux'
import auth, * as fromAuth from './auth.js'
import password, * as fromPassword from './password.js'
import categories, * as fromCategories from './categories.js'
import sources, * as fromSources from  './sources.js'
import models, * as fromModels from  './models.js'
import articles, * as fromArticles from  './articles.js'
import filter, * as fromFilter from  './filter.js'

export default combineReducers({
  auth: auth,
  filter:filter,
  password:password,
  categories:categories,
  sources:sources,
  articles:articles,
  models:models
})

//fromAuth
export const isAuthenticated = state => fromAuth.isAuthenticated(state.auth)
export const get_username = state => fromAuth.get_username(state.auth)
export const accessToken = state => fromAuth.accessToken(state.auth)
export const isAccessTokenExpired = state => fromAuth.isAccessTokenExpired(state.auth)
export const refreshToken = state => fromAuth.refreshToken(state.auth)
export const isRefreshTokenExpired = state => fromAuth.isRefreshTokenExpired(state.auth)
export const authErrors = state => fromAuth.errors(state.auth)

//fromCategories
export const catErrors = state => fromCategories.errors(state.categories)
export const getCategories= state => fromCategories.categories(state.categories)

//fromPassword
export const getPasswordChanged = state => fromPassword.getPasswordChanged(state.password)

//fromSources
export const getSources= state => fromSources.sources(state.sources)
export const getErrors = state => fromSources.errors(state.sources)
export const getLoading = state => fromSources.loading(state.sources)
export const getSaving = state => fromSources.saving(state.sources)
export const getTotalCount = state => fromSources.totalcount(state.sources)
export const getNextPage = state => fromSources.nextPage(state.sources)
export const getPreviousPage = state => fromSources.previousPage(state.sources)
export const getAllLoaded = state => fromSources.allLoaded(state.sources)

//fromArticles
export const getArticles= state => fromArticles.articles(state.articles)
export const getArticleErrors = state => fromArticles.errors(state.articles)
export const getArticleLoading = state => fromArticles.loading(state.articles)
export const getArticleSaving = state => fromArticles.saving(state.articles)
export const getArticleTotalCount = state => fromArticles.totalcount(state.articles)
export const getArticleNextPage = state => fromArticles.nextPage(state.articles)
export const getArticlePreviousPage = state => fromArticles.previousPage(state.articles)

//fromModels
export const getModels= state => fromModels.models(state.models)
export const getModelErrors = state => fromModels.errors(state.models)
export const getModelLoading = state => fromModels.loading(state.models)
export const getModelSaving = state => fromModels.saving(state.models)
export const getModelTotalCount = state => fromModels.totalcount(state.models)
export const getModelNextPage = state => fromModels.nextPage(state.models)
export const getModelPreviousPage = state => fromModels.previousPage(state.models)

//filter
export const getHomeArticleSelections = state => fromFilter.getHomeSelections(state.filter)
export const getFilterSources= state => fromFilter.sources(state.filter)

export function withAuth(headers={}) {
  return (state) => ({
    ...headers,
    'Authorization': `Bearer ${accessToken(state)}`
  })
}
