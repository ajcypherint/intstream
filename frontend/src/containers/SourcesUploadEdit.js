import { connect } from 'react-redux'
import SourceEdit from '../components/SourcesEdit';
import {getSources, setSources} from '../actions/sources'
import * as reducers from '../reducers/'

// edit
const API = '/api/sourcesupload/'
const FIELDS = ["name"]
const HEADING = "Edit Upload Source"

// do not edit
const mapStateToProps = (state) => {
  return { 
    sources:reducers.getSources(state),
    loading:reducers.getLoading(state),
    sourcesErrors:reducers.getErrors(state),
    fields:FIELDS,
    heading:HEADING,
  };
}


const mapDispatchToProps = (dispatch) => {
  return {
    fetchSources: (params=undefined) => dispatch(getSources(API,params)),
    setSources: (url,data) => dispatch(setSources(API+url,data)),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(SourceEdit);
