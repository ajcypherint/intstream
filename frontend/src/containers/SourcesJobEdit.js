import { connect } from 'react-redux'
import SourceEdit from '../components/SourcesEdit';
import {getSources, sourceFormUpdate, addSources, setSources, clearSources} from '../actions/sources'
import {mapStateToPropsFunc, mapDispatchToPropsFunc} from "./EditTemplate.js"
import * as reducers from '../reducers/'

// edit
const API = '/api/sourcesjob/'
const HEADING = "Job Source"
const EMPTY = {name:"",
      id:"", 
      script_path:"",
      working_dir:"",
      virtual_env_path:"",
      python_binary_full_path:"",
      last_run:"",
      arguments:"",
      task:"", //text field for now
      active:false}
const FIELDS = ["name",
  "script_path",
  "working_dir",
  "virtual_env_path",
  "python_binary_full_path",
  "last_run",
  "arguments",
  "task",
  "active"]
const mapStateToProps = mapStateToPropsFunc(EMPTY)(FIELDS)(HEADING)
const mapDispatchToProps = mapDispatchToPropsFunc(API) 


export default connect(mapStateToProps, mapDispatchToProps)(SourceEdit);
