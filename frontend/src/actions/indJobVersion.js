import { RSAA } from 'redux-api-middleware'
import { withAuth } from '../reducers/util'
import { setParams, getAll, setActiveVersionTemplate, getVersionTemplate, setActiveRequestTemplate } from './util'
import { filterChange } from './indJobVersionFilter'
import { INDJOB_VERSION_API } from '../containers/api'

export const GETNO_INDJOBVERSION_REQUEST = '@@indJobVersion/GETNO_INDJOBVERSION_REQUEST'
export const GETNO_INDJOBVERSION_SUCCESS = '@@indJobVersion/GETNO_INDJOBVERSION_SUCCESS'
export const GETNO_INDJOBVERSION_FAILURE = '@@indJobVersion/GETNO_INDJOBVERSION_FAILURE'

export const GET_INDJOBVERSION_REQUEST = '@@indJobVersion/GET_INDJOBVERSION_REQUEST'
export const GET_INDJOBVERSION_SUCCESS = '@@indJobVersion/GET_INDJOBVERSION_SUCCESS'
export const GET_INDJOBVERSION_FAILURE = '@@indJobVersion/GET_INDJOBVERSION_FAILURE'

export const UPDATE_INDJOBVERSION_REQUEST = '@@indJobVersion/UPDATE_INDJOBVERSION_REQUEST'
export const UPDATE_INDJOBVERSION_SUCCESS = '@@indJobVersion/UPDATE_INDJOBVERSION_SUCCESS'
export const UPDATE_INDJOBVERSION_FAILURE = '@@indJobVersion/UPDATE_INDJOBVERSION_FAILURE'

export const PAGE = '@@indJobVersion/INDJOBVERSION_PAGE'

export const setPage = (data) => {
  return {
    type: PAGE,
    payload: data
  }
}

export const getIndJobVersionNoRedux = getVersionTemplate(INDJOB_VERSION_API)(GETNO_INDJOBVERSION_REQUEST)(
  GETNO_INDJOBVERSION_SUCCESS)(
  GETNO_INDJOBVERSION_FAILURE)

export const getIndJobVersion = getVersionTemplate(INDJOB_VERSION_API)(GET_INDJOBVERSION_REQUEST)(
  GET_INDJOBVERSION_SUCCESS)(
  GET_INDJOBVERSION_FAILURE)

export const setActiveRequest = setActiveRequestTemplate(INDJOB_VERSION_API)(
  UPDATE_INDJOBVERSION_REQUEST)(
  UPDATE_INDJOBVERSION_SUCCESS)(
  UPDATE_INDJOBVERSION_FAILURE)

export const setActiveIndJobVersion = setActiveVersionTemplate(getIndJobVersionNoRedux)(
  setActiveRequest)(
  filterChange)
