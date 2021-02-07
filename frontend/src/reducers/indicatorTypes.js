import * as indTypes from '../actions/indicatorTypes'
//  Category object
// {
//    "sources": [
//      2
//    ],
//    "name": "InitialClassifier",
//    "created_date": "2019-05-26T01:31:29.587962Z",
//    "base64_encoded_model": null,
//    "enabled": true
// },
export const initialState = {
  indicatorTypes: [],
  errors: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case indTypes.INDTYPES_SUCCESS: {
      const getIndicatorTypes = [...action.payload.results]
      return {
        indicatorTypes: getIndicatorTypes.sort(),
        errors: {}
      }
    }

    case indTypes.INDTYPES_FAILURE:
      return {
        ...state,
        errors: action.payload.response || { non_field_errors: action.payload.statusText }
      }
    default:
      return state
  }
}

export function indicatorTypes (state) {
  if (state.indicatorTypes) {
    return state.indicatorTypes
  }
}

export function errors (state) {
  return state.errors
}
