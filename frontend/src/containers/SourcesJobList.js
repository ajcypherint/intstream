import { connect } from 'react-redux'
import SourcesList from '../components/SourcesList'
import { getSources, clearSources } from '../actions/sources'
import * as reducers from '../reducers/'
import { mapStateToPropsFunc, mapDispatchToPropsFunc, connectFunc } from './ListTemplate.js'
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

const mapStateToProps = mapStateToPropsFunc(ORDERSTARTCOL)(FIELDS)(HEADING)(EDITURI)(ADDURI)
const mapDispatchToProps = mapDispatchToPropsFunc(JOB_API)
export default connectFunc(mapStateToProps)(mapDispatchToProps)
