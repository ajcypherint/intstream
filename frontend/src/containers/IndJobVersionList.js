import React from 'react'
import { connect } from 'react-redux'
import * as reducers from '../reducers/'
import Main from '../components/VersionList'
import { getJobVersion, setPage, setActiveJobVersion } from '../actions/jobVersion'
import { filterChangeTemplate } from '../actions/jobVersionFilter'
import { INDJOB_VERSION_API } from './api'
import {
  withQueryParams,
  useQueryParams,
  StringParam,
  NumberParam,
  ArrayParam
} from 'use-query-params'

const filterChangeFunc = filterChangeTemplate(INDJOB_VERSION_API)('job')
const getJobVersionFunc = getJobVersion(INDJOB_VERSION_API)
const setPageFunc = setPage(INDJOB_VERSION_API)
const setActiveJobVersionFunc = setActiveJobVersion(INDJOB_VERSION_API)('job')

const mapStateToProps = (state) => ({
  addUri: '/indjobversions_add',
  parentUri: '/sources_indjob',
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
