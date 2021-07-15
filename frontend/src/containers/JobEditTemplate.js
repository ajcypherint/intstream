import { connect } from 'react-redux'
import SourceEdit from '../components/SourcesEdit'
import { mapStateToPropsFunc, mapDispatchToPropsFunc } from './EditTemplate.js'

export default (EMPTY) => (FIELDS) => (HEADING) => (API) =>
  connect(mapStateToPropsFunc(EMPTY)(FIELDS)(HEADING),
    mapDispatchToPropsFunc(API))(SourceEdit)
