import { takeLatest, takeEvery, race, take, put, call, delay } from 'redux-saga/effects'
import { checkTask, CHECK_TASK_POLL, TASK_FAILURE, TASK_SUCCESS } from '../actions/task.js'
import {
  pollingFailure,
  pollingTimeout,
  POLLING_SUCCESS,
  POLLING_TIMEOUT,
  POLLING_FAILURE,
  POLLING_CANCEL,
  pollingDone
} from '../actions/polling.js'

export const SUCCEEDED = 'completed'
export const FAILED = 'failed'
export const TIMEOUT = 260000

export function * checkJobStatus (action) {
  let jobDone = false
  while (!jobDone) {
    yield put(checkTask(action.payload.task_id, action.payload))
    const pollingAction = yield takeLatest([TASK_SUCCESS, TASK_FAILURE])
    if (pollingAction.type === TASK_FAILURE) {
      jobDone = true
      yield put(pollingFailure(action.payload))
      break
    }
    const status = pollingAction.payload.status || 'NA'
    switch (status) {
      case SUCCEEDED:
        jobDone = true
        yield put(pollingDone(action.payload))
        break
      case FAILED:
        jobDone = true
        yield put(pollingDone(action.payload))
        break
      default:
        break
    }
    // delay the next polling request in 5 second
    yield delay(5000)
  }
}

export function * startPollingTask (action) {
  const { response, failed, timeout } = yield race({
    response: call(checkJobStatus, action),
    cancel: take(POLLING_CANCEL), // todo not activated yet; button could cancel request; not necessary ; could just leave timeout
    failed: take(TASK_FAILURE),
    timeout: delay(TIMEOUT)
  })
  // seems to be giving me trouble to take the task failure
  if (timeout) {
    yield put(pollingTimeout(action.payload))
  }
}

export function * root () {
  yield takeEvery(CHECK_TASK_POLL, startPollingTask)
}
