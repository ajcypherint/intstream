import { connect } from 'react-redux'

import SourceEdit from '../components/SourcesEdit';
import {getSources, sourceFormUpdate, addSources, setSources, clearSources} from '../actions/sources'
import * as reducers from '../reducers/'
// edit

// do not edit
export const mapStateToPropsFunc = (EMPTY)=>(FIELDS)=>(HEADING)=>(state) => {
  return { 
    sources:reducers.getSources(state),
    loading:reducers.getLoading(state),
    saving:reducers.getSaving(state),
    errors:reducers.getErrors(state),
    fields:FIELDS,
    heading:HEADING,
    empty:EMPTY
  };
}


export const mapDispatchToPropsFunc = (API)=>(dispatch) => {
  return {
    fetchSources: (params=undefined) => dispatch(getSources(API,params)),
    setSources: (url,data,method='PUT') => dispatch(setSources(API+url,data,method)),
    clearSources:()=>dispatch(clearSources()),
    addSources: (url, data, method, goBack) => dispatch(addSources(API+url, data, method, goBack)),
    sourceFormUpdate:(data)=>dispatch(sourceFormUpdate(data))
  }
}


