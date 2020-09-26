import { connect } from 'react-redux'

import SourceEdit from '../components/SourcesEdit';
import {getSources, sourceFormUpdate, addSources, setSources, clearSources} from '../actions/sources'
import * as reducers from '../reducers/'
import {mapStateToPropsFunc, mapDispatchToPropsFunc} from "./EditTemplate.js"

// edit
const API = '/api/sourcesrss/'
const FIELDS = ["name","url","active"]
const HEADING = " RSS Source"
const EMPTY= {id:"", name:"", url:"", active:false, extract_indicators:false}

// do not edit
const mapStateToProps = mapStateToPropsFunc(EMPTY)(FIELDS)(HEADING)
const mapDispatchToProps = mapDispatchToPropsFunc(API)

export default connect(mapStateToProps, mapDispatchToProps)(SourceEdit);
