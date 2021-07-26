import { takeLatest, takeEvery, race, take, put, call, delay } from 'redux-saga/effects'
import { taskDone, checkTask, CHECK_TASK_POLL, TASK_FAILURE, TASK_SUCCESS } from '../actions/task.js'
import {
  POLLING_CANCEL
} from '../actions/polling.js'

export const SUCCEEDED = 'SUCCESS'
export const FAILED = 'FAILURE'
export const RUNNING = 'RUNNING'
export const TIMEOUT = 260000

export function * checkJobStatus (action) {
  let jobDone = false
  const check_task_id = action.payload.task_id
  while (!jobDone) {
    yield put(checkTask(action.payload.task_id, action.payload))
    const pollingAction = yield take(TASK_SUCCESS)
    // only run for this task
    if (pollingAction.meta.task_id === check_task_id) {
      const results = pollingAction.payload.results
      let status = RUNNING
      if (results.length > 0) {
        status = results[0].status
      }

      switch (status) {
        case SUCCEEDED:
          jobDone = true
          yield put(taskDone(action.payload))
          break
        case FAILED:
          jobDone = true
          yield put(taskDone(action.payload))
          break
        default:
          break
      }
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
    yield put(taskDone(action.payload))
  }
  if (failed) {
    yield put(taskDone(action.payload))
  }
}

export function * root () {
  yield takeEvery(CHECK_TASK_POLL, startPollingTask)
}
