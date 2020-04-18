import { connect } from 'react-redux'
import SourcesList from '../components/SourcesList';
import {getModels,clearModels} from '../actions/models'
import * as reducers from '../reducers/'
import {
  withQueryParams,
  useQueryParams,
  StringParam,
  NumberParam,
  ArrayParam,
} from 'use-query-params';


//edit
const API = '/api/mlmodels/'
const FIELDS = ["id","name","active"]
const HEADING = "Models"
const EDITURI = /models/
const ADDURI = "/models_add"
const ORDERSTARTCOL = "name"

// do not edit
const mapStateToProps = (state) => {
  return { 
    orderStartCol:ORDERSTARTCOL,
    //other
    sourcesList:reducers.getModels(state),
    sourcesLoading:reducers.getModelLoading(state),
    sourcesErrors:reducers.getModelErrors(state),
    fields:FIELDS,
    heading:HEADING,
    totalCount:reducers.getModelTotalCount(state),
    edituri:EDITURI,
    next:reducers.getModelNextPage(state),
    previous:reducers.getModelPreviousPage(state),
    addUri:ADDURI
  };
}


const mapDispatchToProps = (dispatch) => {
  return {
   //other
    fetchSources: (params=undefined) => dispatch(getModels(API,params)),
    fetchSourcesFullUri: (url,params=undefined) => dispatch(getModels(url,params)),
    clearSources:()=>dispatch(clearModels())
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
