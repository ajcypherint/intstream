// reducers/articles.js
//
import _ from 'lodash'
import URL from 'url-parse'
import { ASC, DESC } from '../util/util'
import * as filter from '../actions/modelVersionFilter'

export const NONEVAL = ''

export const initialState = {
  mlmodels: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case filter.CLEAR:
    {
      return {
        ...initialState
      }
    }
    case filter.ALL_MLMODELS:
    {
      return {
        ...state,
        mlmodels: action.payload
      }
    }

    default:
      return state
  }
}

export function mlmodels (state) {
  return state.mlmodels
}
