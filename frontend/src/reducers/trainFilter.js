// reducers/articles.js
//
import _ from 'lodash';
import  URL  from  'url-parse'
import {ASC, DESC} from "../util/util"
import * as filter from '../actions/trainFilter'
export const NONE = "-Select-"
let START = new Date();
START.setHours(0,0,0,0);

let END= new Date();
END.setHours(23,59,59,999);

const initialState ={
  Selections: {
      startDate: START,
      endDate: END,
      mlmodelChosen:NONE,
      sourceChosen:'',
      loadSources:false,
      page:1,
      ordercol:'',
      orderdir:ASC,
      next:null,
      previous:null
  },
  sources: [],
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
     case filter.ALL_SOURCES:
      {
        return {
          ...state,
          sources:action.payload,
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

export function sources(state){
  return state.sources
}
export function mlmodels(state){
  return state.mlmodels
}
