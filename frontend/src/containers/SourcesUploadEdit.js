import { connect } from 'react-redux'
import SourceEdit from '../components/SourcesEdit';
import {getSources, sourceFormUpdate, setSources, addSources, clearSources} from '../actions/sources'
import * as reducers from '../reducers/'
// edit
const API = '/api/sourcesupload/'
const HEADING = "Upload Source"

// do not edit
const mapStateToProps = (state) => {
  return { 
    sources:reducers.getSources(state),
    loading:reducers.getLoading(state),
    saving:reducers.getSaving(state),
    errors:reducers.getErrors(state),
    heading:HEADING,
    emtpy:{name:"",id:"", file:"",active:false}
  };
}


const mapDispatchToProps = (dispatch) => {
  return {
    fetchSources: (params=undefined) => dispatch(getSources(API,params)),
    setSources: (url,data,method='PUT') => dispatch(setSources(API+url,data,method)),
    clearSources:()=>dispatch(clearSources()),
    addSources: (url, data, method, goBack) => dispatch(addSources(API+url, data, method, goBack)),
    sourceFormUpdate:(data)=>dispatch(sourceFormUpdate(data))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(SourceEdit);
