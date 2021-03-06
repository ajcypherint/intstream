// reducers/articles.js
//
import _ from 'lodash'
import URL from 'url-parse'
import { ASC, DESC, NONE, NONEVAL } from '../util/util'
import * as filter from '../actions/trainFilter'

const START = new Date()
START.setHours(0, 0, 0, 0)

const END = new Date()
END.setHours(23, 59, 59, 999)

export const initialState = {
  sources: [],
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
    case filter.ALL_SOURCES:
    {
      return {
        ...state,
        sources: action.payload
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

export function getSelections (state) {
  return state.Selections
}

export function sources (state) {
  return state.sources
}
export function mlmodels (state) {
  return state.mlmodels
}
