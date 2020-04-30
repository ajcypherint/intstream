import { connect } from 'react-redux'

import SourceEdit from '../components/SourcesEdit';
import {getSources, sourceFormUpdate, addSources, setSources, clearSources} from '../actions/sources'
import * as reducers from '../reducers/'
import {mapStateToPropsFunc, mapDispatchToPropsFunc} from "./EditTemplate.js"
import {ADD, EDIT} from "../util/util"
// edit
const API = '/api/orguserinfo/'
const FIELDS = ["username","email","first_name","last_name","is_integrator","is_staff"]
const HEADING = " User "
const EMPTY = {
  username:"",
  email:"",
  first_name:"",
  last_name:"",
  is_integrator:false,
  is_staff:false
}
const mapStateToProps = mapStateToPropsFunc(EMPTY)(FIELDS)(HEADING)
const mapDispatchToProps = mapDispatchToPropsFunc(API)



export default connect(mapStateToProps, mapDispatchToProps)(SourceEdit);
