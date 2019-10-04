import { connect } from 'react-redux'
import SourceEdit from '../components/SourcesEdit';
import {getSources, setSources, clearSources} from '../actions/sources'
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
  };
}


const mapDispatchToProps = (dispatch) => {
  return {
    fetchSources: (params=undefined) => dispatch(getSources(API,params)),
    setSources: (url,data,method='PUT') => dispatch(setSources(API+url,data,method)),
    clearSources:()=>dispatch(clearSources())
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(SourceEdit);
