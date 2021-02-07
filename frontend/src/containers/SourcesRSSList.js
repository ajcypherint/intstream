import { connect } from 'react-redux'
import SourcesList from '../components/SourcesList'
import { getSources, clearSources } from '../actions/sources'
import * as reducers from '../reducers/'
import { mapStateToPropsFunc, mapDispatchToPropsFunc, connectFunc } from './ListTemplate.js'
import {
  withQueryParams,
  useQueryParams,
  StringParam,
  NumberParam,
  ArrayParam
} from 'use-query-params'

// edit
const API = '/api/sourcesrss/'
const FIELDS = ['id', 'name', 'url', 'active', 'extract_indicators']
const HEADING = 'RSS Sources'
const EDITURI = /sources_rss/
const ADDURI = '/sources_rss_add'
const ORDERSTARTCOL = 'name'

const mapStateToProps = mapStateToPropsFunc(ORDERSTARTCOL)(FIELDS)(HEADING)(EDITURI)(ADDURI)
const mapDispatchToProps = mapDispatchToPropsFunc(API)
export default connectFunc(mapStateToProps)(mapDispatchToProps)
