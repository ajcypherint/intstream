import { connect } from 'react-redux'
import SourcesList from '../components/SourcesList';
import {getModels,clearModels} from '../actions/models'
import * as reducers from '../reducers/'
import {mapStateToPropsFunc, mapDispatchToPropsFunc, connectFunc} from './ListTemplate.js'
import {
  withQueryParams,
  useQueryParams,
  StringParam,
  NumberParam,
  ArrayParam,
} from 'use-query-params';


//edit
const API = '/api/mlmodels/'
const FIELDS = ["id","name","active"]
const HEADING = "Models"
const EDITURI = /models/
const ADDURI = "/models_add"
const ORDERSTARTCOL = "name"

const mapStateToProps = mapStateToPropsFunc(ORDERSTARTCOL)(FIELDS)(HEADING)(EDITURI)(ADDURI)
const mapDispatchToProps = mapDispatchToPropsFunc(API) 
export default connectFunc(mapStateToProps)(mapDispatchToProps)

