import { connect } from 'react-redux'
import SourceEdit from '../components/SourcesEdit'
import { getSources, sourceFormUpdate, addSources, setSources, clearSources } from '../actions/sources'
import { mapStateToPropsFunc, mapDispatchToPropsFunc } from './EditTemplate.js'
import * as reducers from '../reducers/'
import { JOB_API } from './api'
import {
  withQueryParams,
  useQueryParams,
  StringParam,
  NumberParam,
  ArrayParam
} from 'use-query-params'

// edit
const HEADING = ' Scheduled Job'
const EMPTY = {
  name: '',
  id: '',
  python_version: '',
  arguments: '',
  cron_day_of_week: '',
  cron_day_of_month: '',
  cron_month_of_year: '',
  cron_hour: '',
  cron_minute: '',
  user: '',
  password: '',
  active: false
}
const FIELDS = ['name',
  'python_version',
  'arguments',
  'last_run',
  'arguments',
  'cron_day_of_week',
  'cron_day_of_month',
  'cron_month_of_year',
  'cron_hour',
  'cron_minute',
  'user',
  'password',
  'active']
const mapStateToProps = mapStateToPropsFunc(EMPTY)(FIELDS)(HEADING)
const mapDispatchToProps = mapDispatchToPropsFunc(JOB_API)

export default connect(mapStateToProps, mapDispatchToProps)(
  SourceEdit)
