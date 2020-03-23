// reducers/articles.js
//
import _ from 'lodash';
import  URL  from  'url-parse'
import {ASC, DESC} from "../util/util"
import * as filter from '../actions/modelVersionFilter'
export const NONEVAL = ""
const initialState ={
  Selections: {
    mlmodelChosen:NONEVAL,
    page:1,
    ordercol:NONEVAL,
    orderdir:ASC,
    next:null,
    previous:null,
  },
  mlmodels:[],
}

export default (state=initialState, action) => {
  switch(action.type) {
      case filter.CLEAR:
      {
        return {
          ...initialState
          }

      }
      case filter.PAGE:
      {
        return {
          ...state,
          Selections:{
            ...state.Selections,
            page:action.payload
          }
        }
      }
      case filter.HOME:
        {
          return {
            ...state,
            Selections:{
              ...state.Selections,
              ...action.payload
            }
          }
            

        }
    case filter.ALL_MLMODELS:
      {
        return {
          ...state,
          mlmodels:action.payload,
        }

      }
 
     default:
      return state
     }

}

export function getSelections(state){
  return  state.Selections
}

export function mlmodels(state){
  return state.mlmodels
}
