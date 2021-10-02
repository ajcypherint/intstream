import { RSAA } from 'redux-api-middleware'
import { withAuth } from '../reducers/util'
import { checkTaskPoll } from './task'

export const uploadDispatch = (func) => (article) => {
  return async (dispatch, getState) => {
    const response = await dispatch(func(indicatorId))
    if (response.error) {
      return
    }
    // wrap dispatch in promise so it is async
    // launch checkTaskPoll which signals saga to launch
    if (response.payload.job_ids.length > 0) {
      await dispatch(checkTaskPoll(
        {
          indicatorId: indicatorId,
          indicatorType: indicatorType,
          task_id: response.payload.job_ids[0]
        }))
    } else {
      await dispatch(noTask(indicatorId))
    }
  }
}

