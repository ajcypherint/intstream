import React from 'react'
import { connect } from 'react-redux'
import * as reducers from '../reducers/'
import Main from '../components/VersionList'
import { getJobVersion, setPage, setActiveJobVersion } from '../actions/jobVersion'
import { filterChangeTemplate } from '../actions/jobVersionFilter'
import { JOB_VERSION_API } from './api'

import {
  withQueryParams,
  useQueryParams,
  StringParam,
  NumberParam,
  ArrayParam
} from 'use-query-params'

const filterChangeFunc = filterChangeTemplate(JOB_VERSION_API)('job')
const getJobVersionFunc = getJobVersion(JOB_VERSION_API)
const setPageFunc = setPage(JOB_VERSION_API)
const setActiveJobVersionFunc = setActiveJobVersion(JOB_VERSION_API)('job')

const mapStateToProps = (state) => ({
  addUri: '/jobversions_add',
  parentUri: '/sources_job',
  List: reducers.getJobVersionFilterJobs(state),
  VersionList: reducers.getJobVersion(state),
  VersionLoading: reducers.getJobVersionLoading(state),
  VersionErrors: reducers.getJobVersionErrors(state),
  VersionTotalCount: reducers.getJobVersionTotalCount(state),
  VersionNext: reducers.getJobVersionNextPage(state),
  VersionPrevious: reducers.getJobVersionPreviousPage(state)

})

const mapDispatchToProps = (dispatch) => ({
  filterChange: (newSelections, setQuery) => dispatch(filterChangeFunc(newSelections, setQuery)),
  fetchVersions: (params = undefined) => dispatch(getJobVersionFunc(params)),
  setPage: (page) => dispatch(setPageFunc(page)),
  setActiveVersion: (job, id, selections, setQuery) => dispatch(setActiveJobVersionFunc(job, id, selections, setQuery))
})

export default connect(mapStateToProps, mapDispatchToProps)(
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
