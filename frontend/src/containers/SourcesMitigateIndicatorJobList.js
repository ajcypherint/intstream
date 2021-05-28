import { connect } from 'react-redux'
import SourcesList from '../components/SourcesList'
import * as reducers from '../reducers/'
import { MITIGATE_IND_JOB_API } from './api'
import { mapStateToPropsFunc, mapDispatchToPropsFunc, connectFunc } from './ListTemplate.js'
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
  'auto_mitigate',
  'manual_mitigate',
  'active']
const HEADING = 'Indicator Mitigate Jobs'
const EDITURI = '/sources_mitigateindicatorjob/'
const ADDURI = '/sources_mitigateindicatorjob_add'
const ORDERSTARTCOL = 'name'

const mapStateToProps = mapStateToPropsFunc(ORDERSTARTCOL)(FIELDS)(HEADING)(EDITURI)(ADDURI)
const mapDispatchToProps = mapDispatchToPropsFunc(MITIGATE_IND_JOB_API)
export default connectFunc(mapStateToProps)(mapDispatchToProps)
