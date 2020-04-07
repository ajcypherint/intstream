import { connect } from 'react-redux'
import SourcesList from '../components/SourcesList';
import {getSources,clearSources} from '../actions/sources'
import {clear, setPage,setOrderCol,setOrderDir} from '../actions/listSelections'
import * as reducers from '../reducers/'
import {
  withQueryParams,
  useQueryParams,
  StringParam,
  NumberParam,
  ArrayParam,
} from 'use-query-params';


// edit
const API = '/api/sourcesupload/'
const FIELDS = ["id","name","active"]
const HEADING = "Upload Sources"
const EDITURI = "/sources_upload/"
const ADDURI = "/sources_upload_add"
const ORDERSTARTCOL = "name"

// do not edit
const mapStateToProps = (state) => {
  return { 
    //selection info
    page:reducers.getListPage(state),
    orderCol:reducers.getListOrderCol(state),
    orderDir:reducers.getListOrderDir(state),
    orderStartCol:ORDERSTARTCOL,
 
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
    //selectioninfo
    clearSelections: () => dispatch(clear()),
    setPage:(page) => dispatch(setPage(page)),
    setOrderCol:(col) => dispatch(setOrderCol(col)),
    setOrderDir:(dir) => dispatch(setOrderDir(dir)),
 
    fetchSources: (params=undefined) => dispatch(getSources(API,params)),
    fetchSourcesFullUri: (url,params=undefined) => dispatch(getSources(url,params)),
    clearSources:()=>dispatch(clearSources())
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(
   withQueryParams( 
  {
    ordering: StringParam,
    page: NumberParam,
    orderDir:StringParam,
  },
  SourcesList));
