import { combineReducers } from 'redux'
import auth, * as fromAuth from './auth.js'
import password, * as fromPassword from './password.js'
import categories, * as fromCategories from './categories.js'
import sources, * as fromSources from  './sources.js'
import models, * as fromModels from  './models.js'
import articles, * as fromArticles from  './articles.js'
import childArticles, * as fromChildArticles from  './children.js'
import randomArticle, * as fromRandomArticle from  './randomArticle.js'
import filter, * as fromFilter from  './filter.js'
import trainFilter, * as fromTrainFilter from  './trainFilter.js'
import childFilter, * as fromChildFilter from  './childFilter.js'
import list, * as fromList from './listSelections.js'
import selectArticles, * as fromSelect from "./selectArticles.js"
import classifications, * as fromClassif from "./classifications"
import settings, * as fromSettings from "./settings"
import modelVersions, * as fromModelVersions from "./modelVersions.js"
import filterModelVer, * as fromFilterModelVer from "./modelVersionFilter.js"

export default combineReducers({
  modelVersions:modelVersions,
  filterModelVer:filterModelVer,
  auth: auth,
  filter:filter,
  password:password,
  categories:categories,
  sources:sources,
  articles:articles,
  models:models,
  list:list,
  randomArticle:randomArticle,
  childArticles:childArticles,
  childFilter:childFilter,
  trainFilter:trainFilter,
  selectArticles:selectArticles,
  classifications:classifications,
  settings:settings,
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
export const getFilterModels= state => fromFilter.models(state.filter)

//trainFilter
export const getTrainSelections = state => fromTrainFilter.getSelections(state.trainFilter)
export const getTrainFilterSources= state => fromTrainFilter.sources(state.trainFilter)
export const getTrainFilterMLModels= state => fromTrainFilter.mlmodels(state.trainFilter)

//listSelections
export const getListPage = state => fromList.getPage(state.list)
export const getListOrderCol = state => fromList.getOrderCol(state.list)
export const getListOrderDir = state => fromList.getOrderDir(state.list)

//random article
export const getRandomArticle = state => fromRandomArticle.articles(state.randomArticle)
export const getRandomErrors= state => fromRandomArticle.errors(state.randomArticle)
export const getRandomLoading = state => fromRandomArticle.loading(state.randomArticle)

//children articles
export const getChildArticles= state => fromChildArticles.articles(state.childArticles)
export const getChildArticleErrors = state => fromChildArticles.errors(state.childArticles)
export const getChildArticleLoading = state => fromChildArticles.loading(state.childArticles)
export const getChildArticleTotalCount = state => fromChildArticles.totalcount(state.childArticles)
export const getChildArticleNextPage = state => fromChildArticles.nextPage(state.childArticles)
export const getChildArticlePreviousPage = state => fromChildArticles.previousPage(state.childArticles)
export const getParentTrail = state => fromChildArticles.parentTrail(state.childArticles)

//childfilter
export const getChildHomeArticleSelections = state => fromChildFilter.getHomeSelections(state.childFilter)

//fromSelect
export const getSelectArticles = state => fromSelect.articles(state.selectArticles)
export const getSelectErrors= state => fromSelect.errors(state.selectArticles)

//fromClassif
export const getClassifications = state => fromClassif.classifications(state.classifications)
export const getClassifErrors = state => fromClassif.errors(state.classifications)
export const getClassifCounts = state => fromClassif.counts(state.classifications)

//fromSettings
export const getSettings= state => fromSettings.settings(state.settings)
export const getSettingsErrors = state => fromSettings.errors(state.settings)
export const getSettingsLoading = state => fromSettings.loading(state.settings)
export const getSettingsSaving = state => fromSettings.saving(state.settings)

//from modelVersions
export const getModelVersion = state => fromModelVersions.versions(state.modelVersions)
export const getModelVersionErrors = state => fromModelVersions.errors(state.modelVersions)
export const getModelVersionLoading = state => fromModelVersions.loading(state.modelVersions)
export const getModelVersionTotalCount = state => fromModelVersions.totalcount(state.modelVersions)
export const getModelVersionNextPage = state => fromModelVersions.nextpage(state.modelVersions)
export const getModelVersionPreviousPage = state => fromModelVersions.previouspage(state.modelVersions)

//from modelVersions
export const getModelVersionFilterMLModels = state => fromFilterModelVer.mlmodels(state.filterModelVer)
export const getModelVersionSelections = state => fromFilterModelVer.getSelections(state.filterModelVer)

export function withAuth(headers={}) {
  return (state) => ({
    ...headers,
    'Authorization': `Bearer ${accessToken(state)}`
  })
}
