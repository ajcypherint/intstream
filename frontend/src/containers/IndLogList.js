import { connect } from 'react-redux'
import * as reducers from '../reducers/'
import Main from '../components/LogList'
import { clear, filterChange } from '../actions/logFilter'
import { getArticles, clearArticles } from '../actions/articles'
import * as fromSelect from '../actions/selectArticle'
import { INDICATOR_JOB_LOGS_API } from './api'

import {
  withQueryParams,
  useQueryParams,
  StringParam,
  DateParam,
  NumberParam,
  ArrayParam
} from 'use-query-params'

const JOB_URI = '/indicatorjob/'
const mapStateToProps = (state) => ({
  test: 'test',
  logsList: reducers.getArticles(state),
  logsLoading: reducers.getArticleLoading(state),
  logsErrors: reducers.getArticleErrors(state),
  logsTotalCount: reducers.getArticleTotalCount(state),
  logNext: reducers.getArticleNextPage(state),
  logPrevious: reducers.getArticlePreviousPage(state),
  loguri: JOB_URI,
  selectLogs: reducers.getSelectArticles(state),
  selectErrors: reducers.getSelectErrors(state)
})

const mapDispatchToProps = (dispatch) => ({
  filterChange: (newSelections, setQuery) => dispatch(filterChange(INDICATOR_JOB_LOGS_API, newSelections, setQuery)),
  fetchLogsFullUri: (url, params = undefined) => dispatch(getArticles(url, params)),
  fetchLogs: (params = undefined) => dispatch(getArticles(INDICATOR_JOB_LOGS_API, params)),
  clearLogs: () => dispatch(clearArticles()),
  clear: () => dispatch(clear()),
  fetchSelect: (id) => dispatch(fromSelect.getArticle(INDICATOR_JOB_LOGS_API, id)),
  clearSelect: () => dispatch(fromSelect.clearArticles())
})

export default connect(mapStateToProps, mapDispatchToProps)(
  withQueryParams(
    {
      job: StringParam,
      ordering: StringParam,
      page: NumberParam,
      orderdir: StringParam,
      choice: NumberParam
    },
    Main))
