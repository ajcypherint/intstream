import React from 'react'
import { connect } from 'react-redux'
import * as reducers from '../reducers/'
import Main from '../components/ModelVersionList'
import {getModelVersion, setPage, setActiveVersion} from '../actions/modelVersion'
import {filterChange} from "../actions/modelVersionFilter"
import {
  withQueryParams,
  useQueryParams,
  StringParam,
  NumberParam,
  ArrayParam,
} from 'use-query-params';

const mapStateToProps = (state) => ({
  modelsList:reducers.getModelVersionFilterMLModels(state),
  modelVersionList:reducers.getModelVersion(state),
  modelVersionLoading:reducers.getModelVersionLoading(state),
  modelVersionErrors:reducers.getModelVersionErrors(state),
  modelVersionTotalCount:reducers.getModelVersionTotalCount(state),
  modelVersionNext:reducers.getModelVersionNextPage(state),
  modelVersionPrevious:reducers.getModelVersionPreviousPage(state),
 
})

const mapDispatchToProps = (dispatch) => ({
  filterChange: (newSelections, setQuery) => dispatch(filterChange(newSelections, setQuery)),
  fetchModelVersions: (params = undefined) => dispatch(getModelVersion(params)),
  setPage:(page)=>dispatch(setPage(page)),
  setActiveVersion: (model, id,selections, setQuery)=>dispatch(setActiveVersion(model, id, selections, setQuery)),
})

export default connect(mapStateToProps, mapDispatchToProps)(
   withQueryParams( 
  {
    ordering: StringParam,
    page: NumberParam,
    orderDir:StringParam,
    mlmodelChosen:StringParam,
  },
  Main));
