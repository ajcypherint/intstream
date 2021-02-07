import _ from 'lodash'
import * as regData from '../actions/registration'
import URL from 'url-parse'
import { ASC, DESC } from '../util/util'

export const initialState = {
  errors: {},
  message: '',
  saving: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case regData.POST_REGISTER_REQUEST:
    {
      return {
        ...state,
        saving: false,
        errors: {}
      }
    }

    case regData.POST_REGISTER_SUCCESS:
    {
      return {
        ...state,
        message: action.payload.message,
        errors: {}
      }
    }

    case regData.POST_REGISTER_FAILURE:
    {
      return {
        ...state,
        saving: false,
        errors: action.payload.response || { non_field_errors: action.payload.statusText }
      }
    }
    default:
      return state
  }
}

export function saving (state) {
  return state.saving
}

export function errors (state) {
  return state.errors
}
export function getRegMessage (state) {
  return state.message
}
