import { connect } from 'react-redux'

import SourceEdit from '../components/SourcesEdit';
import {getSources, sourceFormUpdate, addSources, setSources, clearSources} from '../actions/sources'
import {getOrgs } from '../actions/organizations'
import * as reducers from '../reducers/'
import {ADD, EDIT} from "../util/util"
// edit
const API = '/api/alluserinfo/'
const ORGAPI = '/api/organization/'
const FIELDS = ["username","email","first_name","last_name","is_integrator","is_staff"]
const HEADING = " User "
const EMPTY = {
  username:"",
  email:"",
  first_name:"",
  organization:"",
  last_name:"",
  is_integrator:false,
  is_staff:false
}
// do not edit
export const mapStateToProps = (state) => {
  return { 
    orgs:reducers.getOrgs(state),
    sources:reducers.getSources(state),
    loading:reducers.getLoading(state),
    saving:reducers.getSaving(state),
    errors:reducers.getErrors(state),
    fields:FIELDS,
    heading:HEADING,
    empty:EMPTY
  };
}

export const mapDispatchToProps = (dispatch) => {
  return {
    fetchOrgs: (params=undefined) => dispatch(getOrgs(ORGAPI, params)),
    fetchSources: (params=undefined) => dispatch(getSources(API,params)),
    setSources: (url,data,method='PUT') => dispatch(setSources(API+url,data,method)),
    clearSources:()=>dispatch(clearSources()),
    addSources: (url, data, method, goBack) => dispatch(addSources(API+url, data, method, goBack)),
    sourceFormUpdate:(data)=>dispatch(sourceFormUpdate(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SourceEdit);
