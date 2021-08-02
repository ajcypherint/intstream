import { RSAA } from 'redux-api-middleware'
import { withAuth } from '../reducers/util'
import { setParams, getAll, setActiveVersionTemplate, setActiveRequestTemplate } from './util'
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
// todo move to util
export const getVersionTemplate = (ENDP) => (REQUEST) => (SUCCESS) => (FAILURE) => (params, meta = null) => {
  const url = setParams(ENDP, params)
  return {
    [RSAA]: {
      endpoint: url,
      fetch: fetch,
      method: 'GET',
      body: '',
      headers: withAuth({ 'Content-Type': 'application/json' }),
      types: [
        {
          meta: meta,
          type: REQUEST
        },
        {
          meta: meta,
          type: SUCCESS
        },
        {
          meta: meta,
          type: FAILURE
        }
      ]
    }
  }
}

export const getJobVersionNoRedux = (api, meta = null) => getVersionTemplate(api)(GETNO_JOBVERSIONMULTI_REQUEST)(
  GETNO_JOBVERSIONMULTI_SUCCESS)(
  GETNO_JOBVERSIONMULTI_FAILURE)

export const getJobVersion = (api, meta = null) => getVersionTemplate(api)(GET_JOBVERSIONMULTI_REQUEST)(
  GET_JOBVERSIONMULTI_SUCCESS)(
  GET_JOBVERSIONMULTI_FAILURE)
