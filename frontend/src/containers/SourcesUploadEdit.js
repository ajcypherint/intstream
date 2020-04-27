import { connect } from 'react-redux'
import SourceEdit from '../components/SourcesEdit';
import {getSources, sourceFormUpdate, setSources, addSources, clearSources} from '../actions/sources'
import {mapStateToPropsFunc, mapDispatchToPropsFunc} from "./EditTemplate.js"
import * as reducers from '../reducers/'
// edit
const API = '/api/sourcesupload/'
const HEADING = "Upload Source"
const FIELDS = ["name","file","active"]
const EMPTY = {name:"",id:"", file:"",active:false}

// do not edit
const mapStateToProps = mapStateToPropsFunc(EMPTY)(FIELDS)(HEADING)
const mapDispatchToProps = mapDispatchToPropsFunc(API) 
export default connect(mapStateToProps, mapDispatchToProps)(SourceEdit);
