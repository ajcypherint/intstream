// use indicatorstmp to load pages and retrieve data
//
import * as indCol from '../actions/indicatorColumns'

export const initialState = {
  num: [],
  numErrors: {},

  numData: [],
  numDataErrors: {},

  text: [],
  textErrors: {},

  textData: [],
  textDataErrors: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    // used for edit
    case indCol.GET_INDNUMCOLS_DATA_REQUEST:
    {
      return {
        ...state,
        numDataErrors: {}
      }
    }
    case indCol.GET_INDNUMCOLS_DATA_SUCCESS:
    {
      return {
        ...state,
        numData: action.payload.results
      }
    }
    case indCol.GET_INDNUMCOLS_DATA_FAILURE:
    {
      return {
        ...state,
        numDataErrors: action.payload.response || { non_field_errors: action.payload.statusText }
      }
    }
    case indCol.GET_INDTEXTCOLS_DATA_REQUEST:
    {
      return {
        ...state,
        textDataErrors: {}
      }
    }
    case indCol.GET_INDTEXTCOLS_DATA_SUCCESS:
    {
      return {
        ...state,
        textData: action.payload.results
      }
    }
    case indCol.GET_INDTEXTCOLS_DATA_FAILURE:
    {
      return {
        ...state,
        textDataErrors: action.payload.response || { non_field_errors: action.payload.statusText }
      }
    }

    case indCol.GET_INDNUMCOLS_REQUEST:
    {
      return {
        ...state,
        numErrors: {}
      }
    }
    case indCol.GET_INDNUMCOLS_SUCCESS:
    {
      return {
        ...state,
        num: action.payload.results
      }
    }
    case indCol.GET_INDNUMCOLS_FAILURE:
    {
      return {
        ...state,
        numErrors: action.payload.response || { non_field_errors: action.payload.statusText }
      }
    }
    case indCol.GET_INDTEXTCOLS_REQUEST:
    {
      return {
        ...state,
        textErrors: {}
      }
    }
    case indCol.GET_INDTEXTCOLS_SUCCESS:
    {
      return {
        ...state,
        text: action.payload.results
      }
    }
    case indCol.GET_INDTEXTCOLS_FAILURE:
    {
      return {
        ...state,
        textErrors: action.payload.response || { non_field_errors: action.payload.statusText }
      }
    }
    default:
      return state
  }
}

export function getNum (state) {
  return state.num
}

export function getNumErrors (state) {
  return state.numErrors
}

export function getText (state) {
  return state.text
}

export function getTextErrors (state) {
  return state.textErrors
}

export function getTextData (state) {
  return state.textData
}

export function getTextDataErrors (state) {
  return state.textDataErrors
}
export function getNumDataInfo (state) {
  return state.numData
}

export function getNumDataErrors (state) {
  return state.numDataErrors
}
