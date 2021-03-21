import { connect } from 'react-redux'
import SourcesList from '../components/SourcesList'
import { getSources, clearSources } from '../actions/sources'
import * as reducers from '../reducers/'
import { mapStateToPropsFuncExtra, mapDispatchToPropsFunc, connectFunc } from './ListTemplate.js'
import { JOB_API } from './api'
import {
  withQueryParams,
  useQueryParams,
  StringParam,
  NumberParam,
  ArrayParam
} from 'use-query-params'

// edit
const FIELDS = ['id',
  'name',
  'last_run',
  'last_run_status',
  'active']
const HEADING = 'Scheduled Jobs'
const EDITURI = '/sources_job/'
const ADDURI = '/sources_job_add'
const ORDERSTARTCOL = 'name'
const EXTRA = {
  parentIdentifier: 'job',
  parentUri: '/sources_job'
}
const mapStateToProps = mapStateToPropsFuncExtra(EXTRA)(ORDERSTARTCOL)(FIELDS)(HEADING)(EDITURI)(ADDURI)
const mapDispatchToProps = mapDispatchToPropsFunc(JOB_API)
export default connectFunc(mapStateToProps)(mapDispatchToProps)
