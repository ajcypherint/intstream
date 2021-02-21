import { connect } from 'react-redux'
import SourceEdit from '../components/SourcesEdit'
import { getSources, sourceFormUpdate, addSources, setSources, clearSources } from '../actions/sources'
import { mapStateToPropsFunc, mapDispatchToPropsFunc } from './EditTemplate.js'
import { JOB_VERSION_API } from './api'
import * as reducers from '../reducers/'
import {
  withQueryParams,
  useQueryParams,
  StringParam,
  NumberParam,
  ArrayParam
} from 'use-query-params'

// edit
const HEADING = ' Job Version '

const EMPTY = {
  job: '',
  version: '',
  zip: '',
  active: false
}

const FIELDS = [
  'job',
  'zip',
  'version',
  'active']

const mapStateToProps = mapStateToPropsFunc(EMPTY)(FIELDS)(HEADING)
const mapDispatchToProps = mapDispatchToPropsFunc(JOB_VERSION_API)
export default connect(mapStateToProps, mapDispatchToProps)(withQueryParams(
  {
    job: NumberParam,
    name: StringParam
  },
  SourceEdit))
