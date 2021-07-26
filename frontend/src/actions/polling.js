import { RSAA } from 'redux-api-middleware'
import { withAuth } from '../reducers'
export const POLLING_STARTED = 'POLLING/STARTED'
export const POLLING_SUCCESS = 'POLLING/SUCCESS'
export const POLLING_FAILURE = 'POLLING/FAILED'
export const POLLING_CANCEL = 'POLLING/CANCEL'
export const POLLING_TIMEOUT = 'POLLING/TIMEOUT'

export const pollingStarted = (payload) => (
  {
    type: POLLING_STARTED,
    payload: payload
  }
)
export const pollingCancel = (payload) => (
  {
    type: POLLING_CANCEL,
    payload: payload
  }
)
export const pollingFailure = (payload) => (
  {
    type: POLLING_FAILURE,
    payload: payload
  }
)
export const pollingTimeout = (payload) => (
  {
    type: POLLING_TIMEOUT,
    payload: payload
  }
)
export const pollingDone = (payload) => (
  {
    type: POLLING_SUCCESS,
    payload: payload
  }
)
