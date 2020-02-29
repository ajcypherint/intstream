import { connect } from 'react-redux'
import MLVersion from '../components/MLVersion'
import * as reducers from '../reducers/'
import {getModelVersion, trainRedirect} from "../actions/modelVersion"

const mapStateToProps = (state) => {
  return {
    loading:reducers.getModelVersionLoading(),
    page:reducers.getModelVerPage(),
    next:reducers.getModelVerNextPage(),
    previous:reducers.getModelVerPreviousPage(),
    errors:reducers.getModelVerErrors(),
    versions:reducers.getModelVersions(),
    trainuuid:reducers.getModelVerTrainUuid()

  };
}
const mapDispatchToProps = (dispatch) => {
  return {
    fetchModelVersions:(params)=>dispatch(getModelVersion(params)),
    trainRedirect: (data)=>dispatch(trainRedirect(data))
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(MLVersion);
