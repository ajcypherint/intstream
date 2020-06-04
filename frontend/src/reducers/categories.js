import * as cat from '../actions/categories' 
//  Category object
//{
//    "sources": [
//      2
//    ],
//    "name": "InitialClassifier",
//    "created_date": "2019-05-26T01:31:29.587962Z",
//    "base64_encoded_model": null,
//    "enabled": true
//},
export const initialState ={
  categories:[] ,
  errors: {},
}

export default (state=initialState, action) => {
  switch(action.type) {
    case cat.ADD_CATEGORIES_SUCCESS:
      let new_categories = [action.category,...state.categories]
      return {
        categories:new_categories.sort(),
        errors: {},
      }
    case cat.CATEGORIES_SUCCESS:
      let get_categories = [...action.payload.results]
      return {
        categories:get_categories.sort(),
        errors: {},
      }
 
    case cat.ADD_CATEGORIES_FAILURE:
      return {
        ...state,
         errors: action.payload.response || {'non_field_errors': action.payload.statusText},
      }
    default:
      return state

  }
}

export function categories(state) {
  if (state.categories) {
    return  state.categories
  }
}

export function errors(state) {
  return  state.errors
}
