import { RSAA } from 'redux-api-middleware'
import { withAuth } from '../reducers/util'
import { getIndicatorUpdate } from '../actions/indicators'
import { INDICATOR_PARTIAL } from '../containers/api'

export const TASK_REQUEST = '@@polling/TASK_REQUEST'
export const TASK_SUCCESS = '@@polling/TASK_SUCCESS'
export const TASK_FAILURE = '@@polling/TASK_FAILURE'
export const TASK_POLL = '@@polling/CHECK_TASK_POLL'
export const TASK_CANCEL = '@@polling/CHECK_TASK_CANCEL'
export const TASK_POLL_DONE = '@@polling/CHECK_TASK_POLL_DONE'

export const TASK_FILE_REQUEST = '@@polling/TASK_FILE_REQUEST'
export const TASK_FILE_SUCCESS = '@@polling/TASK_FILE_SUCCESS'
export const TASK_FILE_FAILURE = '@@polling/TASK_FILE_FAILURE'
export const TASK_FILE_POLL = '@@polling/CHECK_TASK_FILE_POLL'
export const TASK_FILE_CANCEL = '@@polling/CHECK_TASK_FILE_CANCEL'
export const TASK_FILE_POLL_DONE = '@@polling/CHECK_TASK_POLL_FILE_DONE'

export const checkTaskPoll = (payload) => ({
  type: TASK_POLL,
  payload: payload
})

export const indicatorTaskDone = (payload) => {
  return async (dispatch, getState) => {
    const resp = await dispatch({
      type: TASK_POLL_DONE,
      payload: payload
    })
    dispatch(getIndicatorUpdate(parseInt(payload.indicatorId)))
  }
}

export const fileTaskDone = (payload) => {
  return async (dispatch, getState) => {
    const resp = await dispatch({
      type: TASK_FILE_POLL_DONE,
      payload: payload
    })
    // dispatch here
  }
}

// called from checkTaskPoll
export const checkTask = (id, meta) => ({
  [RSAA]: {
    endpoint: '/api/taskresult/?task_id=' + id,
    method: 'GET',
    headers: withAuth({ 'Content-Type': 'application/json' }),
    types: [
      {
        type: TASK_REQUEST,
        meta: meta
      },
      {
        type: TASK_SUCCESS,
        meta: meta
      },
      {
        type: TASK_FAILURE,
        meta: meta
      }
    ]
  }

})
