import { connect } from 'react-redux'
import SourcesList from '../components/SourcesList'
import { getTrainingScripts, clearTrainingScripts } from '../actions/models'
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
const API = '/api/trainingscript/'
const FIELDS = ['id', 'name', 'active']
const HEADING = 'TrainingScripts'
const EDITURI = /trainingscripts/
const ADDURI = '/trainingscripts_add'
const ORDERSTARTCOL = 'name'

const mapStateToProps = mapStateToPropsFunc(ORDERSTARTCOL)(FIELDS)(HEADING)(EDITURI)(ADDURI)
const mapDispatchToProps = mapDispatchToPropsFunc(API)
export default connectFunc(mapStateToProps)(mapDispatchToProps)
