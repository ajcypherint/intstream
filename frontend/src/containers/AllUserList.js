import { connect } from 'react-redux'
import SourcesList from '../components/SourcesList';
import {getOrgs } from '../actions/organizations'
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
const FIELDS = ["username","email","organization","is_staff","is_integrator"]
const LOOKUP = ["organization"]
const HEADING = "Users"
const EDITURI = /alluserinfo/
const ADDURI = "/alluserinfo_add"
const ORDERSTARTCOL = "username"
const ORGAPI = '/api/allorganization/'

// do not edit
export const mapStateToProps = (state) => {
  return { 
    organization:reducers.getOrgs(state),
    lookup:LOOKUP,
    orderStartCol:ORDERSTARTCOL,
    sourcesList:reducers.getSources(state),
    sourcesLoading:reducers.getLoading(state),
    sourcesErrors:reducers.getErrors(state),
    fields:FIELDS,
    heading:HEADING,
    totalCount:reducers.getTotalCount(state),
    edituri:EDITURI,
    next:reducers.getNextPage(state),
    previous:reducers.getPreviousPage(state),
    addUri:ADDURI
  };
}


export const mapDispatchToProps = (dispatch) => {
  return {
    fetchOrgs: (params=undefined) => dispatch(getOrgs(ORGAPI, params)),
    fetchSources: (params=undefined) => dispatch(getSources(API,params)),
    fetchSourcesFullUri: (url,params=undefined) => dispatch(getSources(url,params)),
    clearSources:()=>dispatch(clearSources())
  }
}


export default connectFunc(mapStateToProps)(mapDispatchToProps)

