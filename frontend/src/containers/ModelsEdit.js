import { connect } from 'react-redux'
import SourceEdit from '../components/SourcesEdit';
import {getModels,modelFormUpdate, addModels, setModels, clearModels} from '../actions/models'
import {mapStateToPropsFunc, mapDispatchToPropsFunc} from "./EditTemplate.js"
import {getAllSources} from '../actions/sources'
import * as reducers from '../reducers/'

// edit
// models
const API = '/api/mlmodels/'
const HEADING = " Model "

//all sources
const SOURCES_API = '/api/sources/'
const EMPTY={id:"", name:"",active:false}
const FIELDS = ["name","active"]

const mapStateToProps = mapStateToPropsFunc(EMPTY)(FIELDS)(HEADING)
const mapDispatchToProps = mapDispatchToPropsFunc(SOURCES_API) 


export default connect(mapStateToProps, mapDispatchToProps)(SourceEdit);

