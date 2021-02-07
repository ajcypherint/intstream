import { RSAA } from 'redux-api-middleware'
import { withAuth } from '../reducers/util'
import { setParams, getAll } from './util'

export const GET_TRAINING_SCRIPTS_REQUEST = '@@trainingscripts/GET_TRAINING_SCRIPTS_REQUEST'
export const GET_TRAINING_SCRIPTS_SUCCESS = '@@trainingscripts/GET_TRAINING_SCRIPTS_SUCCESS'
export const GET_TRAINING_SCRIPTS_FAILURE = '@@trainingscripts/GET_TRAINING_SCRIPTS_FAILURE'

export const SET_TRAINING_SCRIPTS_REQUEST = '@@trainingscripts/SET_TRAINING_SCRIPTS_REQUEST'
export const SET_TRAINING_SCRIPTS_SUCCESS = '@@trainingscripts/SET_TRAINING_SCRIPTS_SUCCESS'
export const SET_TRAINING_SCRIPTS_FAILURE = '@@trainingscripts/SET_TRAINING_SCRIPTS_FAILURE'

export const SET_TRAINING_SCRIPTS_VERSION_REQUEST = '@@trainingscripts/SET_TRAINING_SCRIPTS_VERSION_REQUEST'
export const SET_TRAINING_SCRIPTS_VERSION_SUCCESS = '@@trainingscripts/SET_TRAINING_SCRIPTS_VERSION_SUCCESS'
export const SET_TRAINING_SCRIPTS_VERSION_FAILURE = '@@trainingscripts/SET_TRAINING_SCRIPTS_VERSION_FAILURE'

export const TRAININGSCRIPT_FORM_UPDATE = '@@trainingscripts/TRAINING_SCRIPTS_FORM_UPDATE'

export const CLEAR = '@@trainingscripts/CLEAR'
export const GET_TOTAL_TRAINING_SCRIPTS = '@@trainingscripts/TOTAL'

export const API = '/api/trainingscript/'
export const clear = () => {
  return {
    type: CLEAR,
    payload: {}

  }
}
export const trainingScriptFormUpdate = (data) => {
  return {
    type: TRAININGSCRIPT_FORM_UPDATE,
    payload: data

  }
}
export const totalTrainingScripts = (data, total) => {
  return {
    type: GET_TOTAL_TRAINING_SCRIPTS,
    payload: { trainingscripts: data, totalCount: total }
  }
}
export const getTrainingScripts = (url, params = undefined) => {
  // filters - list[string]
  url = setParams(url, params)
  return {
    [RSAA]: {
      endpoint: url,
      fetch: fetch,
      method: 'GET',
      body: '',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        GET_TRAINING_SCRIPTS_REQUEST, GET_TRAINING_SCRIPTS_SUCCESS, GET_TRAINING_SCRIPTS_FAILURE
      ]

    }
  }
}

export const editScripts = (url, data, method, goBack) => {
  // change edit to use this instead of setTrainingScripts
  // edit the name if it changed.
  // upload a new version
  return async (dispatch, getState) => {
    const putData = { name: data.name }
    const resp = await dispatch(setTrainingScripts(url, putData))
    if (resp.error) {
      return
    }
    goBack()
  }
}

export const uploadVersion = (url, data, method = 'POST') => {
  // uploads new version for script
  // filters - list[string]
  return {
    [RSAA]: {
      endpoint: url,
      fetch: fetch,
      method: method,
      body: JSON.stringify(data),
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        SET_TRAINING_SCRIPTS_VERSION_REQUEST, SET_TRAINING_SCRIPTS_VERSION_SUCCESS, SET_TRAINING_SCRIPTS_VERSION_FAILURE
      ]

    }
  }
}

export const setTrainingScripts = (url, data, method = 'PUT') => {
  // filters - list[string]
  return {
    [RSAA]: {
      endpoint: url,
      fetch: fetch,
      method: method,
      body: JSON.stringify(data),
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        SET_TRAINING_SCRIPTS_REQUEST, SET_TRAINING_SCRIPTS_SUCCESS, SET_TRAINING_SCRIPTS_FAILURE
      ]

    }
  }
}

export const getAllScripts = getAll(getTrainingScripts)(totalTrainingScripts)

export const addScripts = (url, data, method, goBack) => {
  // url - str
  // data - props: name, file, id
  // method - str
  // goBack - func
  return async (dispatch, getState) => {
    const resp = await dispatch(setTrainingScripts(url, data.name, method))
    const respVersions = await (dispatch(uploadVersion()))
    // todo add file to versions table
    if (!resp.error && !respVersions) {
      goBack()
    }
  }
}
