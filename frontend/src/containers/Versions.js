import { connect } from 'react-redux'
import Versions from '../components/Versions'
import * as reducers from '../reducers/'
import {getModels, API} from '../actions/models'

const mapStateToProps = (state) => {
  return {
    modelList:reducers.getModels(state),
    loading:reducers.getVerLoading(state),
  };
}
const mapDispatchToProps = (dispatch) => {
  return {
    fetchModel: (params=undefined) => dispatch(getModels(API,params)),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Versions);
