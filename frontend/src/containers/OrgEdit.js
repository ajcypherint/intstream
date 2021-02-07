import { connect } from 'react-redux'

import SourceEdit from '../components/SourcesEdit'
import { getSources, sourceFormUpdate, addSources, setSources, clearSources } from '../actions/sources'
import * as reducers from '../reducers/'
import { mapStateToPropsFunc, mapDispatchToPropsFunc } from './EditTemplate.js'

// edit
const API = '/api/organization/'
const FIELDS = ['name']
const HEADING = 'Organization'
const EMPTY = { name: '', id: '' }
// do not edit
const mapStateToProps = mapStateToPropsFunc(EMPTY)(FIELDS)(HEADING)
const mapDispatchToProps = mapDispatchToPropsFunc(API)

export default connect(mapStateToProps, mapDispatchToProps)(SourceEdit)
