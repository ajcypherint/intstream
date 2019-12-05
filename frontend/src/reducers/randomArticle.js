// reducers/articles.js
//
import _ from 'lodash';
import * as random from '../actions/randomArticle';


const initialState ={
  articles:[],
  loading:false,
  errors: {},
}


export default (state=initialState, action) => {
  switch(action.type) {
      //used for edit
   case random.GET_ARTICLE_REQUEST:
      {
      return {
        ...state,
        loading:true,
        errors:{}
      }
      }

    case random.GET_ARTICLE_SUCCESS:
      {
        //let result = _.mapKeys(action.payload.results, 'id'); // maps id field from array to a property name
        //#let newarticlesourcesData= {...result}
      return {
        ...state,
        articles:action.payload,
        loading:false,
        errors: {},
      }
      }
    case random.GET_ARTICLE_FAILURE:
      {
      return {
        ...state,
        articles:[],
        loading:false,
        errors: action.payload.response || {'non_field_errors': action.payload.statusText},
      }
      }
    default:
      return state

  }
}

export function articles(state) {
  if (state.articles) {
    return  state.articles
  }
}

export function loading(state) {
  return  state.loading
}

export function errors(state) {
  return  state.errors
}

