import { connect } from 'react-redux'
import SourceEdit from '../components/SourcesEdit'
import { getModels, modelFormUpdate, addModels, setModels, clearModels } from '../actions/models'
import { mapStateToPropsFunc, mapDispatchToPropsFunc } from './EditTemplate.js'
import { getIndicatorTypes } from '../actions/indicatorTypes'
import { getAllSources } from '../actions/sources'
import * as reducers from '../reducers/'

// edit
// models
const API = '/api/mlmodels/'
const HEADING = ' Model '

// all sources
const SOURCES_API = '/api/sources/'
const EMPTY = { id: '', name: '', active: false }
const FIELDS = ['name', 'active']

// all sources
const mapStateToProps = (state) => {
  return {
    // all sources
    allSources: reducers.getSources(state),
    allSrcLoaded: reducers.getAllLoaded(state),

    // models
    sources: reducers.getModels(state),
    loading: reducers.getModelLoading(state),
    saving: reducers.getModelSaving(state),
    errors: reducers.getModelErrors(state),
    heading: HEADING,
    empty: {
      name: '',
      active: false
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // all sources
    fetchAllSources: (params = undefined) => dispatch(getAllSources(SOURCES_API, params)),
    fetchIndicatorTypes: () => dispatch(getIndicatorTypes()),
    // models
    fetchSources: (params = undefined) => dispatch(getModels(API, params)),
    setSources: (url, data, method = 'PUT') => dispatch(setModels(API + url, data, method)),
    clearSources: () => dispatch(clearModels()),
    addSources: (url, data, method, goBack) => dispatch(addModels(API + url, data, method, goBack)),
    sourceFormUpdate: (data) => dispatch(modelFormUpdate(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SourceEdit)
