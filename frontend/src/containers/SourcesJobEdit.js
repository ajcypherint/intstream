import { connect } from 'react-redux'
import SourceEdit from '../components/SourcesEdit';
import {getSources, addSources, setSources, clearSources} from '../actions/sources'
import * as reducers from '../reducers/'

// edit
const API = '/api/sourcesjob/'
const HEADING = "Job Source"

// do not edit
const mapStateToProps = (state) => {
  return { 
    sources:reducers.getSources(state),
    loading:reducers.getLoading(state),
    saving:reducers.getSaving(state),
    errors:reducers.getErrors(state),
    heading:HEADING,
    empty:{name:"",
      id:"", 
      script_path:"",
      working_dir:"",
      virtual_env_path:"",
      python_binary_full_path:"",
      last_run:"",
      arguments:"",
      task:"", //text field for now
      active:false}
  };
}


const mapDispatchToProps = (dispatch) => {
  return {
    fetchSources: (params=undefined) => dispatch(getSources(API,params)),
    setSources: (url,data,method='PUT') => dispatch(setSources(API+url,data,method)),
    clearSources:()=>dispatch(clearSources()),
    addSources: (url, data, method, goBack) => dispatch(addSources(API+url, data, method, goBack)),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(SourceEdit);
