import { connect } from 'react-redux'
import SourceEdit from '../components/SourcesEdit'
import { getSources, sourceFormUpdate, addSources, setSources, clearSources } from '../actions/sources'
import { mapStateToPropsFunc, mapDispatchToPropsFunc } from './EditTemplate.js'
import * as reducers from '../reducers/'
import { INDJOB_VERSION_API } from './api'
import {
  withQueryParams,
  useQueryParams,
  StringParam,
  NumberParam,
  ArrayParam
} from 'use-query-params'

// edit
const HEADING = ' Hunting Job Version '

const EMPTY = {
  id: '',
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
const mapDispatchToProps = mapDispatchToPropsFunc(INDJOB_VERSION_API)
export default connect(mapStateToProps, mapDispatchToProps)(withQueryParams(
  {
    id: NumberParam,
    name: StringParam
  },
  SourceEdit))
