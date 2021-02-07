import { connect } from 'react-redux'
import SourceEdit from '../components/SourcesEdit'
import { getSources, sourceFormUpdate, addSources, setSources, clearSources } from '../actions/sources'
import { mapStateToPropsFunc, mapDispatchToPropsFunc } from './EditTemplate.js'
import * as reducers from '../reducers/'
import {
  withQueryParams,
  useQueryParams,
  StringParam,
  NumberParam,
  ArrayParam
} from 'use-query-params'

// edit
const API = '/api/jobversion/'
const HEADING = ' Job Version '

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
const mapDispatchToProps = mapDispatchToPropsFunc(API)
export default connect(mapStateToProps, mapDispatchToProps)(withQueryParams(
  {
    id: NumberParam,
    name: StringParam
  },
  SourceEdit))
