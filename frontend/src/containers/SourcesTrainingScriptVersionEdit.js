import { connect } from 'react-redux'
import SourceEdit from '../components/SourcesEdit'
import { getSources, sourceFormUpdate, addSources, setSources, clearSources } from '../actions/sources'
import { mapStateToPropsFunc, mapDispatchToPropsFunc } from './EditTemplate.js'
import * as reducers from '../reducers/'
import { TRAIN_VERSION_API } from './api'
import {
  withQueryParams,
  useQueryParams,
  StringParam,
  NumberParam,
  ArrayParam
} from 'use-query-params'

// edit
const HEADING = ' Training Script Version '

const EMPTY = {
  script: '',
  version: '',
  zip: '',
  active: false
}

const FIELDS = [
  'script',
  'zip',
  'version',
  'active']

const mapStateToProps = mapStateToPropsFunc(EMPTY)(FIELDS)(HEADING)
const mapDispatchToProps = mapDispatchToPropsFunc(TRAIN_VERSION_API)
export default connect(mapStateToProps, mapDispatchToProps)(withQueryParams(
  {
    job: NumberParam,
    name: StringParam
  },
  SourceEdit))
