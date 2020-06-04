// reducers/articles.js
//
import _ from 'lodash';
import  URL  from  'url-parse'
import {ASC, DESC} from "../util/util"
import * as filter from '../actions/filter'


let START = new Date();
START.setHours(0,0,0,0);

let END= new Date();
END.setHours(23,59,59,999);

export const initialState ={
  sources: [],
  models:[]
}

export default (state=initialState, action) => {
  switch(action.type) {
    case filter.ALL_ACTIVE_MODELS:
      {
        return {
          ...state,
          models:action.payload,
        }
      }
     case filter.ALL_SOURCES:
      {
        return {
          ...state,
          sources:action.payload,
        }

      }
 
     default:
      return state
     }

}
export function sources(state){
  return state.sources
}
export function models(state){
  return state.models
}
