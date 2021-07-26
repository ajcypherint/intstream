import { RSAA } from 'redux-api-middleware'
import { withAuth } from '../reducers/util'
import { getIndicatorUpdate } from '../actions/indicators'
import { INDICATOR_PARTIAL } from '../containers/api'
export const TASK_REQUEST = '@@polling/TASK_REQUEST'
export const TASK_SUCCESS = '@@polling/TASK_SUCCESS'
export const TASK_FAILURE = '@@polling/TASK_FAILURE'
export const CHECK_TASK_POLL = '@@polling/CHECK_TASK_POLL'
export const CHECK_TASK_POLL_DONE = '@@polling/CHECK_TASK_POLL_DONE'

export const checkTaskPoll = (payload) => ({
  type: CHECK_TASK_POLL,
  payload: payload
})
export const taskDone = (payload) => {
  return async (dispatch, getState) => {
    const resp = await dispatch({
      type: CHECK_TASK_POLL_DONE,
      payload: payload
    })
    const i = 1
    await dispatch(getIndicatorUpdate(parseInt(payload.indicatorId)))
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
