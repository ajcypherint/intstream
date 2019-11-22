import { connect } from 'react-redux'
import SourcesList from '../components/SourcesList';
import {getModels,clearModels} from '../actions/models'
import * as reducers from '../reducers/'

//edit
const API = '/api/mlmodels/'
const FIELDS = ["id","name","active"]
const HEADING = "Models"
const EDITURI = /models/
const ADDURI = "/models_add"

// do not edit
const mapStateToProps = (state) => {
  return { 
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
    fetchSources: (params=undefined) => dispatch(getModels(API,params)),
    fetchSourcesFullUri: (url,params=undefined) => dispatch(getModels(url,params)),
    clearSources:()=>dispatch(clearModels())
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(SourcesList);
