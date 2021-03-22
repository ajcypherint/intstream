// reducers/articles.js
//
import _ from 'lodash'
import URL from 'url-parse'
import { ASC, DESC } from '../util/util'
import * as filter from '../actions/jobVersionFilter'

export const NONEVAL = ''

export const initialState = {
  jobs: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case filter.CLEAR:
    {
      return {
        ...initialState
      }
    }
    case filter.ALL_JOBS:
    {
      return {
        ...state,
        jobs: action.payload
      }
    }

    default:
      return state
  }
}

export function jobs (state) {
  return state.jobs
}
