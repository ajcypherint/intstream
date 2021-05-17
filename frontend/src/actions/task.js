import { RSAA } from 'redux-api-middleware'
import { withAuth } from '../reducers/util'
export const TASK_REQUEST = '@@polling/TASK_REQUEST'
export const TASK_SUCCESS = '@@polling/TASK_SUCCESS'
export const TASK_FAILURE = '@@polling/TASK_FAILURE'
export const CHECK_TASK_POLL = '@@polling/CHECK_TASK_POLL'

export const checkTaskPoll = (payload) => ({
  type: CHECK_TASK_POLL,
  payload: payload
})

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
