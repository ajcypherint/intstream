import { connect } from 'react-redux'
import SourcesList from '../components/SourcesList';
import {getSources,clearSources} from '../actions/sources'
import * as reducers from '../reducers/'

//edit
const API = '/api/sourcesrss/'
const FIELDS = ["id","name","url","active"]
const HEADING = "RSS Sources"
const EDITURI = /sources_rss/
const ADDURI = "/sources_rss_add"

// do not edit
const mapStateToProps = (state) => {
  return { 
    sourcesList:reducers.getSources(state),
    sourcesLoading:reducers.getLoading(state),
    sourcesErrors:reducers.getErrors(state),
    fields:FIELDS,
    heading:HEADING,
    totalCount:reducers.getTotalCount(state),
    edituri:EDITURI,
    next:reducers.getNextPage(state),
    previous:reducers.getPreviousPage(state),
    addUri:ADDURI
  };
}


const mapDispatchToProps = (dispatch) => {
  return {
    fetchSources: (params=undefined) => dispatch(getSources(API,params)),
    fetchSourcesFullUri: (url,params=undefined) => dispatch(getSources(url,params)),
    clearSources:()=>dispatch(clearSources())
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(SourcesList);
