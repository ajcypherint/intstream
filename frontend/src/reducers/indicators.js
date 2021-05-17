// reducers/indicators.js
//
import _ from 'lodash'
import * as indicatorsData from '../actions/indicators'
import * as mitigate from '../actions/mitigate'
import * as task from '../actions/task'
import URL from 'url-parse'
import { STATUS_RUNNING, STATUS_FAILURE } from '../containers/api'
import { ASC, DESC } from '../util/util'
import { listActions, TAB_MAP, REQ, FAIL, SUCCESS, mapActions } from './tab'

const START = new Date()
START.setHours(0, 0, 0, 0)

const END = new Date()
END.setHours(23, 59, 59, 999)
// use indicatorstmp to load pages and retrieve data

function tabInit (key) {
  return {
    indicators: [],
    loading: false,
    totalcount: 0,
    errors: {},
    nextpage: null,
    previouspage: null,
    saving: false
  }
}

function tabSet (key, state, newValues) {
  return {
    [key]: {
      ...state[key],
      ...newValues
    }
  }
}
export const initialStateDict = {
  indicators: [],
  loading: false,
  totalcount: 0,
  errors: {},
  nextpage: null,
  previouspage: null,
  saving: false
}

export function tabMap () {
  const initialState = {}
  for (const item in TAB_MAP) {
    initialState[item] = {
      ...initialStateDict
    }
  }
  return initialState
}

const initialState = () => {
  const tab = tabMap()
  return {
    ...tab,
    indicators: [],
    loading: false,
    totalcount: 0,
    errors: {},
    nextpage: null,
    previouspage: null,
    saving: false
  }
}

const initState = initialState()
const tabReqActions = listActions(REQ)
const tabFailActions = listActions(FAIL)
const tabSuccessActions = listActions(SUCCESS)
const mapAct = mapActions()

export default (state = initState, action) => {
  if (tabReqActions.includes(action.type)) {
    const key = mapAct[action.type]
    return {
      ...state,
      [key]: {
        ...state[key],
        loading: true,
        errors: {}
      }
    }
  }

  if (tabSuccessActions.includes(action.type)) {
    const key = mapAct[action.type]

    return {
      ...state,
      [key]: {
        ...state[key],
        indicators: action.payload.results,
        totalcount: action.payload.count,
        loading: false,
        nextpage: action.payload.next,
        previouspage: action.payload.previous,
        errors: {}
      }
    }
  }

  if (tabFailActions.includes(action.type)) {
    const key = mapAct[action.type]
    return {
      ...state,
      [key]: {
        ...state[key],
        indicators: [],
        totalcount: 0,
        loading: false,
        nextpage: null,
        previouspage: null,
        errors: action.payload.response || { non_field_errors: action.payload.statusText }
      }

    }
  }

  switch (action.type) {
    // used for edit
    case indicatorsData.SET_INDICATORS_REQUEST:
    {
      const newIndicators = [...state.indicators]
      for (let i = 0; i < newIndicators.length; i++) {
        if (newIndicators[i].id === action.meta.id) {
          newIndicators[i] = {
            ...newIndicators[i],
            saving: true
          }
          break
        }
      }
      return {
        ...state,
        indicators: newIndicators,
        saving: true
      }
    }
    case indicatorsData.SET_INDICATORS_SUCCESS:
    {
      const newIndicators = [...state.indicators]
      for (let i = 0; i < newIndicators.length; i++) {
        if (newIndicators[i].id === action.payload.id) {
          newIndicators[i] = {
            ...newIndicators[i],
            ...action.payload,
            saving: false
          }
          break
        }
      }
      return {
        ...state,
        indicators: newIndicators,
        saving: false
      }
    }
    case indicatorsData.SET_INDICATORS_FAILURE:
    {
      const newIndicators = [...state.indicators]
      for (let i = 0; i < newIndicators.length; i++) {
        if (newIndicators[i].id === action.meta.id) {
          newIndicators[i] = {
            ...newIndicators[i],
            saving: false
          }
          break
        }
      }
      return {
        ...state,
        indicators: newIndicators,
        saving: false,
        errors: action.payload.response || { non_field_errors: action.payload.statusText }
      }
    }
    // used for listing
    case indicatorsData.CLEAR:
    {
      return {
        ...state,
        indicators: [],
        loading: false,
        totalcount: 0,
        errors: {},
        nextpage: null,
        previouspage: null,
        saving: false
      }
    }

    case indicatorsData.GET_INDICATORS_REQUEST:
    {
      return {
        ...state,
        loading: true,
        errors: {}
      }
    }

    case indicatorsData.GET_INDICATORS_SUCCESS:
    {
      // let result = _.mapKeys(action.payload.results, 'id'); // maps id field from array to a property name
      // #let newindicatorsourcesData= {...result}
      return {
        ...state,
        indicators: action.payload.results,
        totalcount: action.payload.count,
        loading: false,
        nextpage: action.payload.next,
        previouspage: action.payload.previous,
        errors: {}
      }
    }
    case indicatorsData.GET_INDICATORS_FAILURE:
    {
      return {
        ...state,
        indicators: [],
        totalcount: 0,
        loading: false,
        nextpage: null,
        previouspage: null,
        errors: action.payload.response || { non_field_errors: action.payload.statusText }
      }
    }
    case mitigate.MITIGATE_REQUEST:
    {
      const newIndicators = [...state.indicators]
      for (let i = 0; i < newIndicators.length; i++) {
        if (newIndicators[i].id === action.meta.indicatorId) {
          newIndicators[i] = {
            ...newIndicators[i],
            mitigateRunningStatus: true
          }
          break
        }
      }
      return {
        ...state,
        indicators: newIndicators
      }
    }
    case mitigate.NO_TASK:
    {
      const newIndicators = [...state.indicators]
      for (let i = 0; i < newIndicators.length; i++) {
        if (newIndicators[i].id === action.meta.indicatorId) {
          newIndicators[i] = {
            ...newIndicators[i],
            mitigateRunningstatus: false
          }
          break
        }
      }
      return {
        ...state,
        indicators: newIndicators
      }
    }
    case task.TASK_SUCCESS:
    {
      // todo(aj) script must return True; all scripts should return result of task
      const newIndicators = [...state.indicators]
      for (let i = 0; i < newIndicators.length; i++) {
        if (newIndicators[i].id === action.meta.indicatorId) {
          newIndicators[i] = {
            ...newIndicators[i],
            mitigateRunningStatus: action.payload.status === STATUS_RUNNING
          }
          break
        }
      }
      return {
        ...state,
        indicators: newIndicators
      }
    }
    default:
      return state
  }
}

export function totalcount (state) {
  return state.totalcount
}

export function indicators (state) {
  if (state.indicators) {
    return state.indicators
  }
}

export function ind (state, type) {
  return state[type]
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
