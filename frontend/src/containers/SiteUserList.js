import { connect } from 'react-redux'

import SourceEdit from '../components/SourcesEdit'
import { getSources, sourceFormUpdate, addSources, setSources, clearSources } from '../actions/sources'
import * as reducers from '../reducers/'
import { ADD, EDIT } from '../util/util'
// edit
const API = '/api/organization/'
const FIELDS = ['name']
const HEADING = 'Organization'

// do not edit
const mapStateToProps = (state) => {
  return {
    sources: reducers.getSources(state),
    loading: reducers.getLoading(state),
    saving: reducers.getSaving(state),
    errors: reducers.getErrors(state),
    fields: FIELDS,
    heading: HEADING,
    empty: { name: '', id: '' }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchSources: (params = undefined) => dispatch(getSources(API, params)),
    setSources: (url, data, method = 'PUT') => dispatch(setSources(API + url, data, method)),
    clearSources: () => dispatch(clearSources()),
    addSources: (url, data, method, goBack) => dispatch(addSources(API + url, data, method, goBack)),
    sourceFormUpdate: (data) => dispatch(sourceFormUpdate(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SourceEdit)
