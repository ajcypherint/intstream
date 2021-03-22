import React from 'react'
import { connect } from 'react-redux'
import * as reducers from '../reducers/'
import Main from '../components/VersionList'
import { getJobVersion, setPage, setActiveJobVersion } from '../actions/jobVersion'
import { filterChangeTemplate } from '../actions/jobVersionFilter'
import { TRAIN_VERSION_API } from './api'

import {
  withQueryParams,
  useQueryParams,
  StringParam,
  NumberParam,
  ArrayParam
} from 'use-query-params'

const filterChangeFunc = filterChangeTemplate(TRAIN_VERSION_API)('script')
const getJobVersionFunc = getJobVersion(TRAIN_VERSION_API)
const setPageFunc = setPage(TRAIN_VERSION_API)
const setActiveJobVersionFunc = setActiveJobVersion(TRAIN_VERSION_API)('script')

const mapStateToProps = (state) => ({
  addUri: '/trainingscriptversions_add',
  parentUri: '/trainingscripts',
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
      orderdir: StringParam
    },
    Main))
