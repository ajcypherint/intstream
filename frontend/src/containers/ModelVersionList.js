import React from 'react'
import { connect } from 'react-redux'
import * as reducers from '../reducers/'
import Main from '../components/ModelVersionList'
import {getModelVersion, setPage} from '../actions/modelVersion'
import {filterChange} from "../actions/modelVersionFilter"

const mapStateToProps = (state) => ({
  modelsList:reducers.getModelVersionFilterMLModels(state),
  selections:reducers.getModelVersionSelections(state),
  modelVersionList:reducers.getModelVersion(state),
  modelVersionLoading:reducers.getModelVersionLoading(state),
  modelVersionErrors:reducers.getModelVersionErrors(state),
  modelVersionTotalCount:reducers.getModelVersionTotalCount(state),
  modelVersionNext:reducers.getModelVersionNextPage(state),
  modelVersionPrevious:reducers.getModelVersionPreviousPage(state),
 
})

const mapDispatchToProps = (dispatch) => ({
  filterChange: (newSelections) => dispatch(filterChange(newSelections)),
  fetchModelVersions: (params = undefined) => dispatch(getModelVersion(params)),
  setPage:(page)=>dispatch(setPage(page)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Main);
