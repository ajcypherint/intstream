import { connect } from 'react-redux'
import SourceEdit from '../components/SourcesEdit'
import { mapStateToPropsFunc, mapDispatchToPropsFunc } from './EditTemplate.js'
import * as reducers from '../reducers/'
import {
  withQueryParams,
  useQueryParams,
  StringParam,
  NumberParam,
  ArrayParam
} from 'use-query-params'

export default (EMPTY) => (
  FIELDS) => (
  HEADING) => (
  INDJOB_VERSION_API
) => connect(
  mapStateToPropsFunc(EMPTY)(FIELDS)(HEADING),
  mapDispatchToPropsFunc(INDJOB_VERSION_API))(
  withQueryParams(
    {
      job: NumberParam,
      name: StringParam
    },
    SourceEdit))
