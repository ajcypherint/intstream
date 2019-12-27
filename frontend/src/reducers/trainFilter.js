// reducers/articles.js
//
import _ from 'lodash';
import  URL  from  'url-parse'
import {ASC, DESC} from "../util/util"
import * as filter from '../actions/trainFilter'

let START = new Date();
START.setHours(0,0,0,0);

let END= new Date();
END.setHours(23,59,59,999);

const initialState ={
  Selections: {
      startDate: START,
      endDate: END,
      mlmodelChosen:undefined,
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
