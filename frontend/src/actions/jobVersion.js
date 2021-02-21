import { RSAA } from 'redux-api-middleware'
import { withAuth } from '../reducers/util'
import { setParams, getAll, setActiveVersionTemplate, getVersionTemplate, setActiveRequestTemplate } from './util'
import { filterChange } from './jobVersionFilter'
import { JOB_VERSION_API } from '../containers/api'

export const GETNO_JOBVERSION_REQUEST = '@@jobVersion/GETNO_JOBVERSION_REQUEST'
export const GETNO_JOBVERSION_SUCCESS = '@@jobVersion/GETNO_JOBVERSION_SUCCESS'
export const GETNO_JOBVERSION_FAILURE = '@@jobVersion/GETNO_JOBVERSION_FAILURE'

export const GET_JOBVERSION_REQUEST = '@@jobVersion/GET_JOBVERSION_REQUEST'
export const GET_JOBVERSION_SUCCESS = '@@jobVersion/GET_JOBVERSION_SUCCESS'
export const GET_JOBVERSION_FAILURE = '@@jobVersion/GET_JOBVERSION_FAILURE'

export const UPDATE_JOBVERSION_REQUEST = '@@jobVersion/UPDATE_JOBVERSION_REQUEST'
export const UPDATE_JOBVERSION_SUCCESS = '@@jobVersion/UPDATE_JOBVERSION_SUCCESS'
export const UPDATE_JOBVERSION_FAILURE = '@@jobVersion/UPDATE_JOBVERSION_FAILURE'

export const PAGE = '@@jobVersion/JOBVERSION_PAGE'

export const setPage = (data) => {
  return {
    type: PAGE,
    payload: data
  }
}

export const getJobVersionNoRedux = getVersionTemplate(JOB_VERSION_API)(GETNO_JOBVERSION_REQUEST)(
  GETNO_JOBVERSION_SUCCESS)(
  GETNO_JOBVERSION_FAILURE)

export const getJobVersion = getVersionTemplate(JOB_VERSION_API)(GET_JOBVERSION_REQUEST)(
  GET_JOBVERSION_SUCCESS)(
  GET_JOBVERSION_FAILURE)

export const setActiveRequest = setActiveRequestTemplate(JOB_VERSION_API)(
  UPDATE_JOBVERSION_REQUEST)(
  UPDATE_JOBVERSION_SUCCESS)(
  UPDATE_JOBVERSION_FAILURE)

export const setActiveJobVersion = setActiveVersionTemplate(getJobVersionNoRedux)(
  setActiveRequest)(
  filterChange)
