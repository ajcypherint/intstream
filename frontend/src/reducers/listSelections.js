// reducers/articles.js
//
import _ from 'lodash';
import  URL  from  'url-parse'
import {ASC, DESC} from "../util/util"
import * as list from "../actions/listSelections"

const initialState ={
      page: 1,
      ordercol:'',
      orderdir:ASC,
}

export default (state=initialState, action) => {
  switch(action.type) {
    case list.CLEAR:
      {
        return initialState
      }
    case list.PAGE:
      {
        return {
          ...state,
          page:action.payload
        }
      }
    case list.ORDER_COL:
      {
        return {
          ...state,
          ordercol:action.payload
        }
      }
    case list.ORDER_DIR:
      {
        return {
          ...state,
          orderdir:action.payload
        }
      }
    default:
      {
        return state
      }

  }
};

export function getPage(state){
  return  state.page
}

export function getOrderCol(state){
  return  state.ordercol
}

export function getOrderDir(state){
  return  state.orderdir
}

