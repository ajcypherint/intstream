// reducers/indicators.js
//
import _ from 'lodash';
import * as indicatorsData from '../actions/indicators';
import  URL  from  'url-parse'
import {ASC, DESC} from "../util/util"

let START = new Date();
START.setHours(0,0,0,0);

let END= new Date();
END.setHours(23, 59, 59, 999);

// use indicatorstmp to load pages and retrieve data
export const initialState ={
  ipv4:{
    indicators:[],
    loading:false,
    totalcount:0,
    errors: {},
    nextpage:null,
    previouspage:null,
    saving:false
  },
  sha1:{
    indicators:[],
    loading:false,
    totalcount:0,
    errors: {},
    nextpage:null,
    previouspage:null,
    saving:false
  },
  sha256:{
    indicators:[],
    loading:false,
    totalcount:0,
    errors: {},
    nextpage:null,
    previouspage:null,
    saving:false
  },
  md5:{
    indicators:[],
    loading:false,
    totalcount:0,
    errors: {},
    nextpage:null,
    previouspage:null,
    saving:false
  },
  netloc:{
    indicators:[],
    loading:false,
    totalcount:0,
    errors: {},
    nextpage:null,
    previouspage:null,
    saving:false
  },
  email:{
    indicators:[],
    loading:false,
    totalcount:0,
    errors: {},
    nextpage:null,
    previouspage:null,
    saving:false
  },
  ipv6:{
    indicators:[],
    loading:false,
    totalcount:0,
    errors: {},
    nextpage:null,
    previouspage:null,
    saving:false
  },
  indicators:[],
  loading:false,
  totalcount:0,
  errors: {},
  nextpage:null,
  previouspage:null,
  saving:false
}


export default (state=initialState, action) => {
  switch(action.type) {
      //used for edit
   case indicatorsData.SET_INDICATORS_REQUEST:
      {

      return {
        ...state,
        saving:true
      }
      }
    case indicatorsData.SET_INDICATORS_SUCCESS:
      {
      return {
        ...state,
        indicators:[action.payload],
        saving:false,
      }
      }
    case indicatorsData.SET_INDICATORS_FAILURE:
      {
      return {
        ...state,
        saving:false,
        errors: action.payload.response || {'non_field_errors': action.payload.statusText},
      }
      }
    //used for listing
    case indicatorsData.CLEAR:
      {
        return {
         ...state,
          indicators:[],
          loading:false,
          totalcount:0,
          errors: {},
          nextpage:null,
          previouspage:null,
          saving:false
        }
      }

    case indicatorsData.GET_IPV4_REQUEST:
      {
      return {
        ...state,
        ipv4:{
          ...state.ipv4,
          loading:true,
          errors:{}
        }
      }
      }

    case indicatorsData.GET_IPV4_SUCCESS:
      {
        //let result = _.mapKeys(action.payload.results, 'id'); // maps id field from array to a property name
        //#let newindicatorsourcesData= {...result}
      return {
        ...state,
        ipv4:{
          ...state.ipv4,
          indicators:action.payload.results,
          totalcount:action.payload.count,
          loading:false,
          nextpage:action.payload.next,
          previouspage:action.payload.previous,
          errors: {},
        }
      }
      }
    case indicatorsData.GET_IPV4_FAILURE:
      {
      return {
        ...state,
        ipv4:{
          ...state.ipv4,
          indicators:[],
          totalcount:0,
          loading:false,
          nextpage:null,
          previouspage:null,
          errors: action.payload.response || {'non_field_errors': action.payload.statusText},
        }
      }
      }
 
 
    case indicatorsData.GET_SHA256_REQUEST:
      {
      return {
        ...state,
        sha256:{
          ...state.sha256,
          loading:true,
          errors:{}
        }
      }
      }

    case indicatorsData.GET_SHA256_SUCCESS:
      {
        //let result = _.mapKeys(action.payload.results, 'id'); // maps id field from array to a property name
        //#let newindicatorsourcesData= {...result}
      return {
        ...state,
        sha256:{
          ...state.sha256,
          indicators:action.payload.results,
          totalcount:action.payload.count,
          loading:false,
          nextpage:action.payload.next,
          previouspage:action.payload.previous,
          errors: {},
        }
      }
      }
    case indicatorsData.GET_SHA256_FAILURE:
      {
      return {
        ...state,
        sha256:{
          ...state.sha256,
          indicators:[],
          totalcount:0,
          loading:false,
          nextpage:null,
          previouspage:null,
          errors: action.payload.response || {'non_field_errors': action.payload.statusText},
        }
      }
      }
 
    case indicatorsData.GET_SHA1_REQUEST:
      {
      return {
        ...state,
        sha1:{
          ...state.sha1,
          loading:true,
          errors:{}
        }
      }
      }

    case indicatorsData.GET_SHA1_SUCCESS:
      {
        //let result = _.mapKeys(action.payload.results, 'id'); // maps id field from array to a property name
        //#let newindicatorsourcesData= {...result}
      return {
        ...state,
        sha1:{
          ...state.sha1,
          indicators:action.payload.results,
          totalcount:action.payload.count,
          loading:false,
          nextpage:action.payload.next,
          previouspage:action.payload.previous,
          errors: {},
        }
      }
      }
    case indicatorsData.GET_SHA1_FAILURE:
      {
      return {
        ...state,
        sha1:{
          ...state.sha1,
          indicators:[],
          totalcount:0,
          loading:false,
          nextpage:null,
          previouspage:null,
          errors: action.payload.response || {'non_field_errors': action.payload.statusText},
        }
      }
      }
   case indicatorsData.GET_IPV6_REQUEST:
      {
      return {
        ...state,
        ipv6:{
          ...state.ipv6,
          loading:true,
          errors:{}
        }
      }
      }

    case indicatorsData.GET_IPV6_SUCCESS:
      {
        //let result = _.mapKeys(action.payload.results, 'id'); // maps id field from array to a property name
        //#let newindicatorsourcesData= {...result}
      return {
        ...state,
        ipv6:{
          ...state.ipv6,
          indicators:action.payload.results,
          totalcount:action.payload.count,
          loading:false,
          nextpage:action.payload.next,
          previouspage:action.payload.previous,
          errors: {},
        }
      }
      }
    case indicatorsData.GET_IPV6_FAILURE:
      {
      return {
        ...state,
        ipv6:{
          ...state.ipv6,
          indicators:[],
          totalcount:0,
          loading:false,
          nextpage:null,
          previouspage:null,
          errors: action.payload.response || {'non_field_errors': action.payload.statusText},
        }
      }
      }
    case indicatorsData.GET_NETLOC_REQUEST:
      {
      return {
        ...state,
        netloc:{
          ...state.netloc,
          loading:true,
          errors:{}
        }
      }
      }
    case indicatorsData.GET_NETLOC_SUCCESS:
      {
        //let result = _.mapKeys(action.payload.results, 'id'); // maps id field from array to a property name
        //#let newindicatorsourcesData= {...result}
      return {
        ...state,
        netloc:{
          ...state.netloc,
          indicators:action.payload.results,
          totalcount:action.payload.count,
          loading:false,
          nextpage:action.payload.next,
          previouspage:action.payload.previous,
          errors: {},
        }
      }
      }
    case indicatorsData.GET_NETLOC_FAILURE:
      {
      return {
        ...state,
        netloc:{
          ...state.netloc,
          indicators:[],
          totalcount:0,
          loading:false,
          nextpage:null,
          previouspage:null,
          errors: action.payload.response || {'non_field_errors': action.payload.statusText},
        }
      }
      }
 
    case indicatorsData.GET_EMAIL_REQUEST:
      {
      return {
        ...state,
        email:{
          ...state.email,
          loading:true,
          errors:{}
        }
      }
      }

    case indicatorsData.GET_EMAIL_SUCCESS:
      {
        //let result = _.mapKeys(action.payload.results, 'id'); // maps id field from array to a property name
        //#let newindicatorsourcesData= {...result}
      return {
        ...state,
        email:{
          ...state.email,
          indicators:action.payload.results,
          totalcount:action.payload.count,
          loading:false,
          nextpage:action.payload.next,
          previouspage:action.payload.previous,
          errors: {},
        }
      }
      }
    case indicatorsData.GET_EMAIL_FAILURE:
      {
      return {
        ...state,
        email:{
          ...state.email,
          indicators:[],
          totalcount:0,
          loading:false,
          nextpage:null,
          previouspage:null,
          errors: action.payload.response || {'non_field_errors': action.payload.statusText},
        }
      }
      }
 
    case indicatorsData.GET_MD5_REQUEST:
      {
      return {
        ...state,
        md5:{
          ...state.md5,
          loading:true,
          errors:{}
        }
      }
      }

    case indicatorsData.GET_MD5_SUCCESS:
      {
        //let result = _.mapKeys(action.payload.results, 'id'); // maps id field from array to a property name
        //#let newindicatorsourcesData= {...result}
      return {
        ...state,
        md5:{
          ...state.md5,
          indicators:action.payload.results,
          totalcount:action.payload.count,
          loading:false,
          nextpage:action.payload.next,
          previouspage:action.payload.previous,
          errors: {},
        }
      }
      }
    case indicatorsData.GET_MD5_FAILURE:
      {
      return {
        ...state,
        md5:{
          ...state.md5,
          indicators:[],
          totalcount:0,
          loading:false,
          nextpage:null,
          previouspage:null,
          errors: action.payload.response || {'non_field_errors': action.payload.statusText},
        }
      }
      }
 
    case indicatorsData.GET_INDICATORS_REQUEST:
      {
      return {
        ...state,
        loading:true,
        errors:{}
      }
      }

    case indicatorsData.GET_INDICATORS_SUCCESS:
      {
        //let result = _.mapKeys(action.payload.results, 'id'); // maps id field from array to a property name
        //#let newindicatorsourcesData= {...result}
      return {
        ...state,
        indicators:action.payload.results,
        totalcount:action.payload.count,
        loading:false,
        nextpage:action.payload.next,
        previouspage:action.payload.previous,
        errors: {},
      }
      }
    case indicatorsData.GET_INDICATORS_FAILURE:
      {
      return {
        ...state,
        indicators:[],
        totalcount:0,
        loading:false,
        nextpage:null,
        previouspage:null,
         errors: action.payload.response || {'non_field_errors': action.payload.statusText},
      }
      }
    default:
      return state

  }
}

export function totalcount(state){
  return state.totalcount;
}

export function indicators(state) {
  if (state.indicators) {
    return  state.indicators
  }
}

export function netloc(state) {
  if (state.netloc) {
    return  state.netloc
  }
}

export function email(state) {
  if (state.email) {
    return  state.email
  }
}

export function ipv6(state) {
  if (state.ipv6) {
    return  state.ipv6
  }
}
export function ipv4(state) {
  if (state.ipv4) {
    return  state.ipv4
  }
}
export function sha1(state) {
  if (state.sha1) {
    return  state.sha1
  }
}
export function sha256(state) {
  if (state.sha256) {
    return  state.sha256
  }
}
export function md5(state) {
  if (state.md5) {
    return  state.md5
  }
}




export function nextPage(state){
  if (state.nextpage != null){
    let fullUrl = new URL(state.nextpage)
    let path = fullUrl.pathname+fullUrl.query
    return path
  }
  else{
    return state.nextpage
  }
}

export function previousPage(state){
  if (state.previouspage != null){
    let fullUrl = new URL(state.previouspage)
    let path = fullUrl.pathname+fullUrl.query
    return path
  }
  else{
    return state.previouspage
  }

}

export function loading(state) {
  return  state.loading
}
export function saving(state) {
  return  state.saving
}

export function errors(state) {
  return  state.errors
}

