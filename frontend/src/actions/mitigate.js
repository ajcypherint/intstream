import { RSAA } from 'redux-api-middleware'
import { withAuth } from '../reducers/util'
import { checkTaskPoll } from './task'
import { UNMITIGATE_INDICATOR_API, MITIGATE_INDICATOR_API } from '../containers/api'
export const MITIGATE_REQUEST = '@@mitigate/MITIGATE_REQUEST'
export const MITIGATE_SUCCESS = '@@mitigate/MITIGATE_SUCCESS'
export const MITIGATE_FAILURE = '@@mitigate/MITIGATE_FAILURE'

export const UNMITIGATE_REQUEST = '@@mitigate/UNMITIGATE_REQUEST'
export const UNMITIGATE_SUCCESS = '@@mitigate/UNMITIGATE_SUCCESS'
export const UNMITIGATE_FAILURE = '@@mitigate/UNMITIGATE_FAILURE'

export const SET_REQUEST = '@@mitigate/SET_REQUEST'
export const SET_SUCCESS = '@@mitigate/SET_SUCCESS'
export const SET_FAILURE = '@@mitigate/SET_FAILURE'

export const MITIGATE_DELETE = '@@mitigate/MITIGATE_DELETE'

export const NO_TASK = '@@mitigate/NO_TASK'
export const deleteMitigate = (payload) => ({
  type: MITIGATE_DELETE,
  payload: payload
})

export const mitigateTemplate = (action) => (ENDPOINT) => (REQUEST) => (SUCCESS) => (FAILURE) => (indicatorId) => ({
  [RSAA]: {
    endpoint: ENDPOINT,
    method: 'POST',
    body: JSON.stringify({ indicator_id: indicatorId, action: action }),
    headers: withAuth({ 'Content-Type': 'application/json' }),
    types: [
      {
        type: REQUEST,
        meta: { indicatorId: indicatorId }
      },
      {
        type: SUCCESS,
        meta: { indicatorId: indicatorId }
      },
      {
        type: FAILURE,
        meta: { indicatorId: indicatorId }
      }
    ]
  }
})

export const mitigate = mitigateTemplate('mitigate')(MITIGATE_INDICATOR_API)(MITIGATE_REQUEST)(MITIGATE_SUCCESS)(MITIGATE_FAILURE)
export const unmitigate = mitigateTemplate('unmitigate')(MITIGATE_INDICATOR_API)(MITIGATE_REQUEST)(MITIGATE_SUCCESS)(MITIGATE_FAILURE)

export const noTask = (indicatorId) => ({
  type: NO_TASK,
  meta: { indicatorId: indicatorId }
})

export const mitigateDispatchTemplate = (func) => (indicatorId, action) => {
  return async (dispatch, getState) => {
    const response = await dispatch(func(indicatorId, action))
    if (response.error) {
      return
    }
    // wrap dispatch in promise so it is async
    // launch checkTaskPoll which signlas saga to launch
    if (response.payload.job_ids.length > 0) {
      dispatch(checkTaskPoll(
        {
          indicatorId: indicatorId,
          task_id: response.payload.job_ids[0]
        }))
    } else {
      dispatch(noTask(indicatorId))
    }
  }
}

export const mitigateDispatch = mitigateDispatchTemplate(mitigate)
export const unmitigateDispatch = mitigateDispatchTemplate(unmitigate)
