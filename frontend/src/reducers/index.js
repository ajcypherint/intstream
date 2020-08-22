import { combineReducers } from 'redux'
import auth, * as fromAuth from './auth'
import password, * as fromPassword from './password'
import categories, * as fromCategories from './categories'
import sources, * as fromSources from  './sources'
import models, * as fromModels from  './models'
import articles, * as fromArticles from  './articles'
import orgs, * as fromOrgs from  './organizations'
import childArticles, * as fromChildArticles from  './children'
import randomArticle, * as fromRandomArticle from  './randomArticle'
import filter, * as fromFilter from  './filter'
import trainFilter, * as fromTrainFilter from  './trainFilter'
import selectArticles, * as fromSelect from "./selectArticles"
import classifications, * as fromClassif from "./classifications"
import settings, * as fromSettings from "./settings"
import modelVersions, * as fromModelVersions from "./modelVersions"
import filterModelVer, * as fromFilterModelVer from "./modelVersionFilter"
import forgotPassword, * as fromForgotPassword from "./forgotPassword"
import trainingScripts, * as fromTrainingScripts from "./trainingScripts"
import registration, * as fromRegistration from "./registration"

export default combineReducers({
  modelVersions:modelVersions,
  trainingScripts:trainingScripts,
  filterModelVer:filterModelVer,
  auth: auth,
  filter:filter,
  password:password,
  categories:categories,
  sources:sources,
  articles:articles,
  models:models,
  randomArticle:randomArticle,
  childArticles:childArticles,
  trainFilter:trainFilter,
  selectArticles:selectArticles,
  classifications:classifications,
  settings:settings,
  orgs:orgs,
  forgotPassword:forgotPassword,
  registration:registration,
})
//fromAuth
export const isAuthenticated = state => fromAuth.isAuthenticated(state.auth)
export const get_username = state => fromAuth.get_username(state.auth)
export const accessToken = state => fromAuth.accessToken(state.auth)
export const isIntegrator = state => fromAuth.isIntegrator(state.auth)
export const isStaff = state => fromAuth.isStaff(state.auth)
export const isSuperuser= state => fromAuth.isSuperuser(state.auth)

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

//fromOrgs
export const getOrgs= state => fromOrgs.orgs(state.orgs)
export const getOrgErrors = state => fromOrgs.errors(state.orgs)
export const getOrgLoading = state => fromOrgs.loading(state.orgs)
export const getOrgSaving = state => fromOrgs.saving(state.orgs)
export const getOrgTotalCount = state => fromOrgs.totalcount(state.orgs)
export const getOrgNextPage = state => fromOrgs.nextPage(state.orgs)
export const getOrgPreviousPage = state => fromOrgs.previousPage(state.orgs)


//fromModels
export const getModels= state => fromModels.models(state.models)
export const getModelErrors = state => fromModels.errors(state.models)
export const getModelLoading = state => fromModels.loading(state.models)
export const getModelSaving = state => fromModels.saving(state.models)
export const getModelTotalCount = state => fromModels.totalcount(state.models)
export const getModelNextPage = state => fromModels.nextPage(state.models)
export const getModelPreviousPage = state => fromModels.previousPage(state.models)

//filter
export const getFilterSources= state => fromFilter.sources(state.filter)
export const getFilterModels= state => fromFilter.models(state.filter)

//trainFilter
export const getTrainFilterSources= state => fromTrainFilter.sources(state.trainFilter)
export const getTrainFilterMLModels= state => fromTrainFilter.mlmodels(state.trainFilter)

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

//forgotPassword
export const getFPassErrors = state => fromForgotPassword.errors(state.forgotPassword)
export const getFPMessage = state => fromForgotPassword.getFPMessage(state.forgotPassword)

//fromTrainingScripts
export const getTrainingScripts = state => fromTrainingScripts.trainingScripts(state.trainingScripts)
export const getTrainingScriptsErrors = state => fromTrainingScripts.errors(state.trainingScripts)
export const getTrainingScriptsLoading = state => fromTrainingScripts.loading(state.trainingScripts)
export const getTrainingScriptsSaving = state => fromTrainingScripts.saving(state.trainingScripts)
export const getTrainingScriptsTotalCount = state => fromTrainingScripts.totalcount(state.trainingScripts)
export const getTrainingScriptsNextPage = state => fromTrainingScripts.nextPage(state.trainingScripts)
export const getTrainingScriptsPreviousPage = state => fromTrainingScripts.previousPage(state.trainingScripts)

//fromRegistration
export const getRegErrors = state => fromRegistration.errors(state.registration)
export const getRegSaving = state => fromRegistration.saving(state.registration)
export const getRegMessage = state => fromRegistration.getRegMessage(state.registration)



export function withAuth(headers={}) {
  return (state) => ({
    ...headers,
    'Authorization': `Bearer ${accessToken(state)}`
  })
}
