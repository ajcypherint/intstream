import { connect } from 'react-redux'
import * as reducers from '../reducers/'
import One from '../components/LogList'
import { clear, filterChange } from '../actions/logFilter'
import { getArticles, clearArticles } from '../actions/articles'
import * as fromSelect from '../actions/selectArticle'
import { JOB_LOGS_API } from './api'

import {
  withQueryParams,
  useQueryParams,
  StringParam,
  DateParam,
  NumberParam,
  ArrayParam
} from 'use-query-params'

const JOB_URI = '/job/'
const mapStateToProps = (state) => ({
  test: 'test',
  logsList: reducers.getArticles(state),
  LogsLoading: reducers.getArticleLoading(state),
  LogsErrors: reducers.getArticleErrors(state),
  LogsTotalCount: reducers.getArticleTotalCount(state),
  LogNext: reducers.getArticleNextPage(state),
  LogPrevious: reducers.getArticlePreviousPage(state),
  Loguri: JOB_URI
})

const mapDispatchToProps = (dispatch) => ({
  filterChange: (newSelections, setQuery) => dispatch(filterChange(JOB_LOGS_API, newSelections, setQuery)),
  fetchLogsFullUri: (url, params = undefined) => dispatch(getArticles(url, params)),
  fetchLogs: (params = undefined) => dispatch(getArticles(JOB_LOGS_API, params)),
  clearLogs: () => dispatch(clearArticles()),
  clear: () => dispatch(clear()),
  fetchSelect: (id) => dispatch(fromSelect.getArticle(JOB_LOGS_API, id)),
  clearSelect: () => dispatch(fromSelect.clearArticles())
})

export default connect(mapStateToProps, mapDispatchToProps)(
  withQueryParams(
    {
      job: NumberParam,
      ordering: StringParam,
      page: NumberParam,
      orderdir: StringParam,
      choice: NumberParam
    },
    One))
