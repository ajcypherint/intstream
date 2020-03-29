import { connect } from 'react-redux'
import CreateMLVersion from '../components/CreateMLVersion'
import * as reducers from '../reducers/'
import {getModelVersion, trainRedirect} from "../actions/modelVersion"
import {getModels,clearModels, API} from '../actions/models'

const mapStateToProps = (state) => {
  return {
    modelList:reducers.getModels(state),
    trainCreateErrors:reducers.getModelVersionErrors(state),
  };
}
const mapDispatchToProps = (dispatch) => {
  return {
    trainRedirect: (model, history, uri, metric)=>dispatch(trainRedirect(model, history, uri,  metric)),
    fetchModel: (params=undefined) => dispatch(getModels(API,params)),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateMLVersion);
