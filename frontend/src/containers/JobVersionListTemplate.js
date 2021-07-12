import React from 'react'
import { connect } from 'react-redux'
import * as reducers from '../reducers/'
import Main from '../components/VersionList'
import { getJobVersion, setPage, setActiveJobVersion } from '../actions/jobVersion'
import { filterChangeTemplate } from '../actions/jobVersionFilter'

import {
  withQueryParams,
  useQueryParams,
  StringParam,
  NumberParam,
  ArrayParam
} from 'use-query-params'

const mapStateToProps = (addUri) => (parentUri) => (state) => ({
  addUri: addUri,
  parentUri: parentUri,
  List: reducers.getJobVersionFilterJobs(state),
  VersionList: reducers.getJobVersion(state),
  VersionLoading: reducers.getJobVersionLoading(state),
  VersionErrors: reducers.getJobVersionErrors(state),
  VersionTotalCount: reducers.getJobVersionTotalCount(state),
  VersionNext: reducers.getJobVersionNextPage(state),
  VersionPrevious: reducers.getJobVersionPreviousPage(state)

})

const mapDispatchToProps = (API) => (dispatch) => ({
  filterChange: (newSelections, setQuery) => dispatch(filterChangeTemplate(API)('job')(newSelections, setQuery)),
  fetchVersions: (params = undefined) => dispatch(getJobVersion(API)(params)),
  setPage: (page) => dispatch(setPage(API)(page)),
  setActiveVersion: (job, id, selections, setQuery) => dispatch(setActiveJobVersion(API)('job')(job, id, selections, setQuery))
})

export default (addUri) => (parentUri) => (API) => connect(mapStateToProps(addUri)(parentUri), mapDispatchToProps(API))(
  withQueryParams(
    {
      job: StringParam,
      name: StringParam,
      ordering: StringParam,
      page: NumberParam,
      orderdir: StringParam,
      chosen: StringParam
    },
    Main))
