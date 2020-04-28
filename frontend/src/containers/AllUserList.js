import { connect } from 'react-redux'
import SourcesList from '../components/SourcesList';
import {getSources,clearSources} from '../actions/sources'
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
const API = '/api/alluserinfo/'
const FIELDS = ["username","email","is_staff","is_integrator"]
const HEADING = "Users"
const EDITURI = /alluserinfo/
const ADDURI = "/alluserinfo_add"
const ORDERSTARTCOL = "username"

const mapStateToProps = mapStateToPropsFunc(ORDERSTARTCOL)(FIELDS)(HEADING)(EDITURI)(ADDURI)
const mapDispatchToProps = mapDispatchToPropsFunc(API) 
export default connectFunc(mapStateToProps)(mapDispatchToProps)

