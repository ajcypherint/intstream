import { connect } from 'react-redux'
import SourcesList from '../components/SourcesList'
import * as reducers from '../reducers/'
import { mapStateToPropsFunc, mapDispatchToPropsFunc, connectFunc } from './ListTemplate.js'
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

const mapStateToProps = mapStateToPropsFunc(ORDERSTARTCOL)(FIELDS)(HEADING)(EDITURI)(ADDURI)
const mapDispatchToProps = mapDispatchToPropsFunc(API)
export default connectFunc(mapStateToProps)(mapDispatchToProps)
