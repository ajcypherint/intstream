// reducers/sources.js
//
import _ from 'lodash'
import * as dAction from '../actions/dropDown'
import URL from 'url-parse'

const requestDropdown = (action, initialState) => {
  const newState = {
    ...initialState,
    [action.meta.key]: {
      results: [],
      loading: true,
      allloaded: false,
      totalcount: 0,
      nextpage: null,
      previouspage: null,
      errors: {}
    }
  }
  return newState
}

const successDropdown = (action, initialState) => {
  const newState = {
    ...initialState,
    [action.meta.key]: {
      results: action.payload.results,
      loading: false,
      allloaded: false,
      totalcount: action.payload.count,
      nextpage: action.payload.next,
      previouspage: action.payload.previous,
      errors: {}
    }
  }
  return newState
}

const failDropdown = (action, initialState) => {
  const newState = {
    ...initialState,
    [action.meta.key]: {
      results: [],
      loading: true,
      allloaded: false,
      totalcount: 0,
      nextpage: null,
      previouspage: null,
      errors: action.payload.response || { non_field_errors: action.payload.statusText }
    }
  }
  return newState
}

const setAllDropdown = (action, initialState) => {
  const newState = {
    ...initialState,
    [action.meta.key]: {
      results: action.payload.results,
      loading: false,
      allloaded: true,
      totalcount: action.payload.count,
      nextpage: action.payload.next,
      previouspage: action.payload.previous,
      errors: {}
    }
  }
  return newState
}
export const initialState = {
}

export default (state = initialState, action) => {
  switch (action.type) {
    case dAction.CLEAR:
    {
      return {
        ...initialState

      }
    }

    case dAction.GET_DROPDOWN_REQUEST:
    {
      return requestDropdown(action, state)
    }

    case dAction.GET_DROPDOWN_SUCCESS:
    {
      // let result = _.mapKeys(action.payload.results, 'id'); // maps id field from array to a property name
      // #let newsourcesourcesData= {...result}

      return successDropdown(action, state)
    }
    case dAction.GET_DROPDOWN_FAILURE:
    {
      return failDropdown(action, state)
    }
    default:
      return state
  }
}

export function values (state) {
  return state
}
