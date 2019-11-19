import { connect } from 'react-redux'
import ModelEdit from '../components/ModelsEdit';
import {getModels, addModels, setModels, clearModels} from '../actions/models'
import * as reducers from '../reducers/'

// edit
const API = '/api/mlmodels/'
const HEADING = "Model"

// do not edit
const mapStateToProps = (state) => {
  return { 
    sources:reducers.getModels(state),
    loading:reducers.getLoading(state),
    saving:reducers.getSaving(state),
    errors:reducers.getErrors(state),
    heading:HEADING,
    empty:{name:"",
      active:false}
  };
}


const mapDispatchToProps = (dispatch) => {
  return {
    fetchSources: (params=undefined) => dispatch(getModels(API,params)),
    setSources: (url,data,method='PUT') => dispatch(setModels(API+url,data,method)),
    clearSources:()=>dispatch(clearModels()),
    addSources: (url, data, method, goBack) => dispatch(addModels(API+url, data, method, goBack)),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ModelEdit);
