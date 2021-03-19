import { connect } from 'react-redux'
import SourceEdit from '../components/SourcesEdit'
import { getTrainingScripts, trainingScriptFormUpdate, addScripts, editScripts, clear } from '../actions/trainingScripts'
import * as reducers from '../reducers/'
import { mapStateToPropsFunc, mapDispatchToPropsFunc } from './EditTemplate.js'

// edit
const HEADING = ' Training Scripts'
const API = '/api/trainingscript/'
const EMPTY = {
  name: '',
  id: ''
}
const FIELDS = ['name']

const mapStateToProps = mapStateToPropsFunc(EMPTY)(FIELDS)(HEADING)
const mapDispatchToProps = mapDispatchToPropsFunc(API)

export default connect(mapStateToProps, mapDispatchToProps)(
  SourceEdit)
