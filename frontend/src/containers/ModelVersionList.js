import React from 'react'
import { connect } from 'react-redux'
import * as reducers from '../reducers/'
import Main from '../components/VersionList'
import { getModelVersion, setPage, setActiveVersion } from '../actions/modelVersion'
import { filterChange } from '../actions/modelVersionFilter'
import {
  withQueryParams,
  useQueryParams,
  StringParam,
  NumberParam,
  ArrayParam
} from 'use-query-params'

const mapStateToProps = (state) => ({
  List: reducers.getModelVersionFilterMLModels(state),
  VersionList: reducers.getModelVersion(state),
  VersionLoading: reducers.getModelVersionLoading(state),
  VersionErrors: reducers.getModelVersionErrors(state),
  VersionTotalCount: reducers.getModelVersionTotalCount(state),
  VersionNext: reducers.getModelVersionNextPage(state),
  VersionPrevious: reducers.getModelVersionPreviousPage(state)

})

const mapDispatchToProps = (dispatch) => ({
  filterChange: (newSelections, setQuery) => dispatch(filterChange(newSelections, setQuery)),
  fetchVersions: (params = undefined) => dispatch(getModelVersion(params)),
  setPage: (page) => dispatch(setPage(page)),
  setActiveVersion: (model, id, selections, setQuery) => dispatch(setActiveVersion(model, id, selections, setQuery))
})

export default connect(mapStateToProps, mapDispatchToProps)(
  withQueryParams(
    {
      ordering: StringParam,
      page: NumberParam,
      orderdir: StringParam,
      chosen: StringParam
    },
    Main))
