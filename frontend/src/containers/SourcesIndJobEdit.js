import { connect } from 'react-redux'
import SourceEdit from '../components/SourcesEdit'
import { getSources, sourceFormUpdate, addSources, setSources, clearSources } from '../actions/sources'
import { mapStateToPropsFunc, mapDispatchToPropsFunc } from './EditTemplate.js'
import * as reducers from '../reducers/'
import {
  withQueryParams,
  useQueryParams,
  StringParam,
  NumberParam,
  ArrayParam
} from 'use-query-params'

// edit
const API = '/api/indicatorjob/'
const HEADING = ' Hunting Job'
const EMPTY = {
  name: '',
  id: '',
  python_version: '',
  arguments: '',
  user: '',
  password: '',
  active: false
}
const FIELDS = ['name',
  'python_version',
  'arguments',
  'last_run',
  'arguments',
  'user',
  'password',
  'active']
const mapStateToProps = mapStateToPropsFunc(EMPTY)(FIELDS)(HEADING)
const mapDispatchToProps = mapDispatchToPropsFunc(API)

export default connect(mapStateToProps, mapDispatchToProps)(SourceEdit)
