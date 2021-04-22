import { connect } from 'react-redux'
import * as reducers from '../reducers/'
import Main from '../components/TaskList'
import { clear, filterChangeTask } from '../actions/logFilter'
import { getArticles, clearArticles } from '../actions/articles'
import * as fromSelect from '../actions/selectArticle'
import { TASK_RESULT_API } from './api'

import {
  withQueryParams,
  useQueryParams,
  StringParam,
  DateParam,
  NumberParam,
  ArrayParam
} from 'use-query-params'

const mapStateToProps = (state) => ({
  logsList: reducers.getArticles(state),
  logsLoading: reducers.getArticleLoading(state),
  logsErrors: reducers.getArticleErrors(state),
  logsTotalCount: reducers.getArticleTotalCount(state),
  logNext: reducers.getArticleNextPage(state),
  logPrevious: reducers.getArticlePreviousPage(state)
})

const mapDispatchToProps = (dispatch) => ({
  filterChange: (newSelections, setQuery) => dispatch(filterChangeTask(TASK_RESULT_API, newSelections, setQuery)),
  fetchLogsFullUri: (url, params = undefined) => dispatch(getArticles(url, params)),
  fetchLogs: (params = undefined) => dispatch(getArticles(TASK_RESULT_API, params)),
  clearLogs: () => dispatch(clearArticles()),
  clear: () => dispatch(clear()),
  fetchSelect: (id) => dispatch(fromSelect.getArticle(TASK_RESULT_API, id)),
  clearSelect: () => dispatch(fromSelect.clearArticles())
})

export default connect(mapStateToProps, mapDispatchToProps)(
  withQueryParams(
    {
      startDate: DateParam,
      endDate: DateParam,
      ordering: StringParam,
      page: NumberParam,
      orderdir: StringParam,
      choice: NumberParam
    },
    Main))
