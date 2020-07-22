import { connect } from 'react-redux'
import SourceEdit from '../components/SourcesEdit';
import {getTrainingScripts, trainingScriptFormUpdate, addScripts, editScripts, clear} from '../actions/trainingScripts'
import * as reducers from '../reducers/'

// edit
const HEADING = " Training Scripts"
const API = '/api/trainingscript/'
const EMPTY = {name:"",
      id:"", 
      }
const FIELDS = ["name", ]


export const mapStateToProps = (state) => {
  return { 
    sources:reducers.getTrainingScripts(state),
    loading:reducers.getTrainingScriptsLoading(state),
    saving:reducers.getTrainingScriptsSaving(state),
    errors:reducers.getTrainingScriptsErrors(state),
    fields:FIELDS,
    heading:HEADING,
    empty:EMPTY
  };
}


export const mapDispatchToProps = (dispatch) => {
  return {
    fetchSources: (params=undefined) => dispatch(getTrainingScripts(API,params)),
    setSources: (url,data,method='PUT') => dispatch(editScripts(API+url,data,method)),
    clearSources:()=>dispatch(clear()),
    addSources: (url, data, method, goBack) => dispatch(addScripts(API+url, data, method, goBack)),
    sourceFormUpdate:(data)=>dispatch(trainingScriptFormUpdate(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SourceEdit);
