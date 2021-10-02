import { connect } from 'react-redux'
import { PAGINATION, MULTIPARTFORM, JSONFORM } from '../actions/util'

import SourceEdit from '../components/SourcesEdit'
import { getSources, sourceFormUpdate, addSources, setSources, clearSources } from '../actions/sources'
import { getIndicatorTypes } from '../actions/indicatorTypes'
import * as reducers from '../reducers/'
import { getAllDropDown } from '../actions/dropDown'
import {
  FILEUPLOAD_API
} from './api'

// edit
import {
  withQueryParams,
  DelimitedNumericArrayParam,
  JsonParam,
  useQueryParams,
  StringParam,
  NumberParam,
  ArrayParam,
  ObjectParam,
  DateParam
} from 'use-query-params'

const empty = {
  id: 0,
  title: '',
  file: ''

}

const mapStateToPropsFunc = (state) => {
  return {
    dropDown: reducers.getDropDown(state),
    sources: reducers.getSources(state),
    loading: reducers.getLoading(state),
    saving: reducers.getSaving(state),
    errors: reducers.getErrors(state),
    empty: empty,
    heading: ' File'
  }
}

const mapDispatchToPropsFunc = (dispatch) => {
  return {
    fetchSources: (params = undefined) => dispatch(getSources(FILEUPLOAD_API, params)),
    fetchArticleTypes: (api, params, key) => dispatch(getAllDropDown(api, params, key)),
    setSources: (url, data, method = 'PUT') => dispatch(setSources(FILEUPLOAD_API + url, data, method)),
    fetchIndicatorTypes: () => dispatch(getIndicatorTypes()),
    clearSources: () => dispatch(clearSources()),
    addSources: (url, data, method, goBack, contentType = JSONFORM) => dispatch(addSources(FILEUPLOAD_API + url, data, method, goBack, contentType)),
    sourceFormUpdate: (data) => dispatch(sourceFormUpdate(data))
  }
}

export default connect(mapStateToPropsFunc, mapDispatchToPropsFunc)(
  withQueryParams(
    {
      indicatorType: NumberParam
    },
    SourceEdit))
