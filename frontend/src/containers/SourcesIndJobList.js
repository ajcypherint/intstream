import { connect } from 'react-redux'
import SourcesList from '../components/SourcesList'
import { getSources, clearSources } from '../actions/sources'
import * as reducers from '../reducers/'
import { mapStateToPropsFuncExtra, mapDispatchToPropsFunc, connectFunc } from './ListTemplate.js'
import {
  withQueryParams,
  useQueryParams,
  StringParam,
  NumberParam,
  ArrayParam
} from 'use-query-params'

// edit
const API = '/api/indicatorjob/'
const FIELDS = ['id',
  'name',
  'last_run',
  'last_run_status',
  'active']
const HEADING = 'Hunting Jobs'
const EDITURI = '/sources_indjob/'
const ADDURI = '/sources_indjob_add'
const ORDERSTARTCOL = 'name'
const EXTRA = {
  parentIdentifier: 'job',
  parentUri: '/sources_indjob'
}

const mapStateToProps = mapStateToPropsFuncExtra(EXTRA)(ORDERSTARTCOL)(FIELDS)(HEADING)(EDITURI)(ADDURI)
const mapDispatchToProps = mapDispatchToPropsFunc(API)
export default connectFunc(mapStateToProps)(mapDispatchToProps)
