import { RSAA } from 'redux-api-middleware'
import { withAuth } from '../reducers/util'
import { setParams, getAll, setActiveVersionTemplate, getVersionTemplate, setActiveRequestTemplate } from './util'
import { filterChangeTemplate } from './jobVersionFilter'

export const GETNO_JOBVERSIONMULTI_REQUEST = '@@jobVersion/GETNO_JOBVERSIONMULTI_REQUEST'
export const GETNO_JOBVERSIONMULTI_SUCCESS = '@@jobVersion/GETNO_JOBVERSIONMULTI_SUCCESS'
export const GETNO_JOBVERSIONMULTI_FAILURE = '@@jobVersion/GETNO_JOBVERSIONMULTI_FAILURE'

export const GET_JOBVERSIONMULTI_REQUEST = '@@jobVersion/GET_JOBVERSIONMULTI_REQUEST'
export const GET_JOBVERSIONMULTI_SUCCESS = '@@jobVersion/GET_JOBVERSIONMULTI_SUCCESS'
export const GET_JOBVERSIONMULTI_FAILURE = '@@jobVersion/GET_JOBVERSIONMULTI_FAILURE'

export const UPDATE_JOBVERSIONMULTI_REQUEST = '@@jobVersion/UPDATE_JOBVERSIONMULTI_REQUEST'
export const UPDATE_JOBVERSIONMULTI_SUCCESS = '@@jobVersion/UPDATE_JOBVERSIONMULTI_SUCCESS'
export const UPDATE_JOBVERSIONMULTI_FAILURE = '@@jobVersion/UPDATE_JOBVERSIONMULTI_FAILURE'

export const PAGE = '@@jobVersion/JOBVERSIONMULTI_PAGE'

export const setPage = (data) => {
  return {
    type: PAGE,
    payload: data
  }
}

export const getJobVersionNoRedux = (api, meta = null) => getVersionTemplate(api)(GETNO_JOBVERSIONMULTI_REQUEST)(
  GETNO_JOBVERSIONMULTI_SUCCESS)(
  GETNO_JOBVERSIONMULTI_FAILURE)

export const getJobVersion = (api, meta = null) => getVersionTemplate(api)(GET_JOBVERSIONMULTI_REQUEST)(
  GET_JOBVERSIONMULTI_SUCCESS)(
  GET_JOBVERSIONMULTI_FAILURE)

export const setActiveRequest = (api, meta = null) => setActiveRequestTemplate(api)(
  UPDATE_JOBVERSIONMULTI_REQUEST)(
  UPDATE_JOBVERSIONMULTI_SUCCESS)(
  UPDATE_JOBVERSIONMULTI_FAILURE)

export const setActiveJobVersion = (api, meta = null) => (parentField) => setActiveVersionTemplate(parentField)(
  getJobVersionNoRedux(api))(
  setActiveRequest(api))(
  filterChangeTemplate(api)(parentField))
