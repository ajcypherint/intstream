import { connect } from 'react-redux'
import SourceEdit from '../components/SourcesEdit'
import { getSources, sourceFormUpdate, addSources, setSources, clearSources } from '../actions/sources'
import { mapStateToPropsFunc, mapDispatchToPropsFunc } from './EditTemplate.js'
import { MITIGATE_IND_JOB_API } from './api'
import * as reducers from '../reducers/'
import {
  withQueryParams,
  useQueryParams,
  StringParam,
  NumberParam,
  ArrayParam
} from 'use-query-params'

// edit
const HEADING = ' Mitigate Indicator Job'
const EMPTY = {
  name: '',
  id: '',
  python_version: '',
  arguments: '',
  user: '',
  password: '',
  auto_mitigate: false,
  manual_mitigate: false,
  active: false
}
const FIELDS = ['name',
  'python_version',
  'arguments',
  'last_run',
  'arguments',
  'user',
  'password',
  'auto_mitigte',
  'manual_mitigate',
  'active']
const mapStateToProps = mapStateToPropsFunc(EMPTY)(FIELDS)(HEADING)
const mapDispatchToProps = mapDispatchToPropsFunc(MITIGATE_IND_JOB_API)

export default connect(mapStateToProps, mapDispatchToProps)(SourceEdit)
