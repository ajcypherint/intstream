import React from 'react'
import { connect } from 'react-redux'
import * as reducers from '../reducers/'
import Main from '../components/VersionList'
import {getIndJobVersion, setPage, setActiveIndJobVersion} from '../actions/indJobVersion'
import {filterChange} from "../actions/indJobVersionFilter"
import {
  withQueryParams,
  useQueryParams,
  StringParam,
  NumberParam,
  ArrayParam,
} from 'use-query-params';

const mapStateToProps = (state) => ({
  List:reducers.getJobVersionFilterJobs(state),
  VersionList:reducers.getJobVersion(state),
  VersionLoading:reducers.getJobVersionLoading(state),
  VersionErrors:reducers.getJobVersionErrors(state),
  VersionTotalCount:reducers.getJobVersionTotalCount(state),
  VersionNext:reducers.getJobVersionNextPage(state),
  VersionPrevious:reducers.getJobVersionPreviousPage(state),
 
})

const mapDispatchToProps = (dispatch) => ({
  filterChange: (newSelections, setQuery) => dispatch(filterChange(newSelections, setQuery)),
  fetchVersions: (params = undefined) => dispatch(getIndJobVersion(params)),
  setPage:(page)=>dispatch(setPage(page)),
  setActiveVersion: (model, id,selections, setQuery)=>dispatch(setActiveIndJobVersion(model, id, selections, setQuery)),
})

export default connect(mapStateToProps, mapDispatchToProps)(
   withQueryParams( 
  {
    id:StringParam,
    name:StringParam,
    ordering: StringParam,
    page: NumberParam,
    orderdir:StringParam,
    chosen:StringParam,
  },
  Main));
