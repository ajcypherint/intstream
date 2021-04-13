import { connect } from 'react-redux'
import { PAGINATION, MULTIPARTFORM, JSONFORM } from '../actions/util'

import SourceEdit from '../components/SourcesEdit'
import { getSources, sourceFormUpdate, addSources, setSources, clearSources } from '../actions/sources'
import { userInfo } from '../actions/userInfo'
import { getIndicatorTypes } from '../actions/indicatorTypes'
import * as reducers from '../reducers/'
import { ORG_USER_INFO_API, ORG_USER_INFO_KEY } from './api'
import { getAllDropDown } from '../actions/dropDown'
// edit

// do not edit
export const mapStateToPropsFunc = (EMPTY) => (FIELDS) => (HEADING) => (state) => {
  return {
    dropDown: reducers.getDropDown(state),
    indicatorTypes: reducers.getIndicatorTypes(state),
    sources: reducers.getSources(state),
    loading: reducers.getLoading(state),
    saving: reducers.getSaving(state),
    errors: reducers.getErrors(state),
    fields: FIELDS,
    heading: HEADING,
    empty: EMPTY
  }
}

export const mapDispatchToPropsFunc = (API) => (dispatch) => {
  return {
    fetchSources: (params = undefined) => dispatch(getSources(API, params)),
    fetchOrgUserInfo: (api, params, key) => dispatch(getAllDropDown(api, params, key)),
    fetchIndicatorTypes: () => dispatch(getIndicatorTypes()),
    setSources: (url, data, method = 'PUT') => dispatch(setSources(API + url, data, method)),
    clearSources: () => dispatch(clearSources()),
    addSources: (url, data, method, goBack, contentType = JSONFORM) => dispatch(addSources(API + url, data, method, goBack, contentType)),
    sourceFormUpdate: (data) => dispatch(sourceFormUpdate(data))
  }
}
