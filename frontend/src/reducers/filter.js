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

const initialState ={
  homeSelections: {
      startDate: START,
      endDate: END,
      sourceChosen:'',
      loadSources:false,
      page:1,
      ordercol:'',
      orderdir:ASC,
      next:null,
      previous:null
  },
  sources: [],
}

export default (state=initialState, action) => {
  switch(action.type) {
      case filter.PAGE:
      {
        return {
          ...state,
          homeSelections:{
            ...state.homeSelections,
            page:action.payload
          }
        }
      }
      case filter.HOME:
        {
          return {
            ...state,
            homeSelections:{
              ...state.homeSelections,
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

export function getHomeSelections(state){
  return  state.homeSelections
}

export function sources(state){
  return state.sources
}
