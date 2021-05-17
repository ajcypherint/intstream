import * as jobVersionData from '../actions/jobVersionMulti'

export const initialState = { }

export default (state = initialState, action) => {
  switch (action.type) {
    case jobVersionData.GET_JOBVERSIONMULTI_REQUEST:
    {
      const newState = { ...state }
      newState[action.meta.identifier] = {
        versions: [],
        loading: false,
        totalcount: 0,
        errors: {},
        nextpage: null,
        previouspage: null
      }
      return newState
    }
    case jobVersionData.GET_JOBVERSIONMULTI_SUCCESS:
    {
      const newState = { ...state }
      newState[action.meta.identifier] = {
        versions: action.payload.results,
        loading: false,
        totalcount: action.payload.count,
        errors: {},
        nextpage: action.payload.next,
        previouspage: action.payload.previous
      }
      return newState
    }
    case jobVersionData.GET_JOBVERSIONMULTI_FAILURE:
    {
      // todo
      const newState = { ...state }
      newState[action.meta.identifier] = {
        ...state,
        errors: action.payload.response || { non_field_errors: action.payload.statusText }
      }
      return newState
    }

    default:
      return state
  }
}
export function versions (state) {
  return state
}
