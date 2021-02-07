//
import _ from 'lodash'
import * as orgsData from '../actions/organizations'
import URL from 'url-parse'
import { ASC, DESC } from '../util/util'

const START = new Date()
START.setHours(0, 0, 0, 0)

const END = new Date()
END.setHours(23, 59, 59, 999)

export const initialState = {
  orgs: [],
  loading: false,
  totalcount: 0,
  errors: {},
  nextpage: null,
  previouspage: null,
  saving: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    // used for edit
    case orgsData.SET_ORGANIZATIONS_REQUEST:
    {
      return {
        ...state,
        saving: true
      }
    }
    case orgsData.SET_ORGANIZATIONS_SUCCESS:
    {
      return {
        ...state,
        orgs: [action.payload],
        saving: false
      }
    }
    case orgsData.SET_ORGANIZATIONS_FAILURE:
    {
      return {
        ...state,
        saving: false,
        errors: action.payload.response || { non_field_errors: action.payload.statusText }
      }
    }
    // used for listing
    case orgsData.CLEAR:
    {
      return {
        ...state,
        orgs: [],
        loading: false,
        totalcount: 0,
        errors: {},
        nextpage: null,
        previouspage: null,
        saving: false
      }
    }

    case orgsData.GET_ORGANIZATIONS_REQUEST:
    {
      return {
        ...state,
        loading: true,
        errors: {}
      }
    }

    case orgsData.GET_ORGANIZATIONS_SUCCESS:
    {
      // let result = _.mapKeys(action.payload.results, 'id'); // maps id field from array to a property name
      return {
        ...state,
        orgs: action.payload.results,
        totalcount: action.payload.count,
        loading: false,
        nextpage: action.payload.next,
        previouspage: action.payload.previous,
        errors: {}
      }
    }
    case orgsData.GET_ORGANIZATIONS_FAILURE:
    {
      return {
        ...state,
        orgs: [],
        totalcount: 0,
        loading: false,
        nextpage: null,
        previouspage: null,
        errors: action.payload.response || { non_field_errors: action.payload.statusText }
      }
    }
    default:
      return state
  }
}

export function totalcount (state) {
  return state.totalcount
}

export function orgs (state) {
  if (state.orgs) {
    return state.orgs
  }
}

export function nextPage (state) {
  if (state.nextpage != null) {
    const fullUrl = new URL(state.nextpage)
    const path = fullUrl.pathname + fullUrl.query
    return path
  } else {
    return state.nextpage
  }
}

export function previousPage (state) {
  if (state.previouspage != null) {
    const fullUrl = new URL(state.previouspage)
    const path = fullUrl.pathname + fullUrl.query
    return path
  } else {
    return state.previouspage
  }
}

export function loading (state) {
  return state.loading
}
export function saving (state) {
  return state.saving
}

export function errors (state) {
  return state.errors
}
