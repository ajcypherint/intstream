import React, { Component } from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { Alert, Form, Row, Col, Button, FormGroup, Input } from 'reactstrap'
import DatePicker from 'react-datepicker'
import { dateString, NONE, NONEVAL, ASC, DESC } from '../util/util'
import Paginate from './Paginate'

import { changesort } from './ChangeSort'

export default class Main extends Component {
  constructor (props) {
    super(props)
    this.handleStartChange = this.handleStartChange.bind(this)
    this.handleEndChange = this.handleEndChange.bind(this)
    this.updateDate = this.updateDate.bind(this)
    this.paginate = Paginate.bind(this)
    this.changesort = changesort.bind(this)
    this.fetchit = this.fetchit.bind(this)
    this.getArticle = this.getArticle.bind(this)
    this.redirect = this.redirect.bind(this)
  }

  handleStartChange (date) {
    const selections = this.props.query
    this.updateDate(date, selections.endDate, true)
  }

  handleEndChange (date) {
    const selections = this.props.query
    this.updateDate(selections.startDate, date, false)
  }

  updateDate (startDate, endDate, start_filter = true) {
    // unset sourceChosen
    // fix start_date or end_date based on input
    // startdate - date
    // enddate - date
    // start_end - bool
    if (start_filter === true) {
      if (startDate > endDate) {
        endDate = new Date(startDate.getTime())
      }
    } else {
      if (endDate < startDate) {
        startDate = new Date(endDate.getTime())
        // fix start date
        // fix end date
      }
    }
    const newSelections = {
      ...this.props.query,
      page: 1
    }
    this.props.filterChange(newSelections, this.props.setQuery)
  }

  getArticle (event) {
    const { id } = event.target.dataset
    this.props.clearSelect()
    this.props.fetchSelect(id)
  }

  fetchit (selections, page) {
    const newSelections = {
      ...selections,
      page: page
    }
    this.props.filterChange(newSelections, this.props.setQuery)
  }

  componentDidMount () {
    // action
    const job = this.props.query.job
    const trueFalse = this.props.query.trueFalse || ''
    const ordering = this.props.query.ordering || 'title'
    const page = this.props.query.page || 1
    const orderdir = this.props.query.orderdir || ''
    const parent_id = this.props.query.parent_id || ''
    const selections = {
      job: job,
      ...this.props.query,
      ordering: ordering,
      page: page,
      orderdir: orderdir,
      parent_id: parent_id,
      trueFalse: trueFalse
    }
    this.props.setQuery(selections)
    if (selections.mlmodelChosen === NONEVAL) {
      this.props.clearLogs()
    } else {
      const str = 'ordering=' + orderdir +
        ordering +
        '&job=' + job +
        '&page=' + page

      this.props.fetchLogs(str)
    }
  }

  render () {
    const logs = this.props.LogsList || []
    const errors = this.props.LogsErrors || {}
    const selections = this.props.query || {}
    const totalcount = this.props.logsTotalCount || 0
    const next = this.props.LogNext
    const previous = this.props.LogPrevious
    const loading = this.props.LogsLoading
    const selectLogs = this.props.selectLogs || {}
    // todo; move this to the backend.
    return (

      <div className="container mt-2 col-sm-12 " >

        {errors.non_field_errors ? <Alert color="danger">{errors.non_field_errors}</Alert> : ''}
    <table className="table">
    <tr>
          <td colSpan={4}>
         {this.paginate(totalcount,
           next,
           previous,
           this.fetchit,
           this.props.fetchLogsFullUri,
           this.props.query,
           this.props.setQuery
         )}
         </td>
      </tr>
      <tr>
      <td>
         <table className={'table table-sm '}>
         <thead>
           <tr>
             <td className="hover" onClick={(event) => {
               this.changesort('title',
                 ASC,
                 DESC,
                 selections,
                 this.props.filterChange,
                 this.props.setQuery,
                 0
               )
             }}>Date</td>
          </tr>
         </thead>
         { !loading
           ? logs.map((log) => {
             return (
                <tbody key={log.id}>
                <tr key={log.id}>
                 <td className="hover" data-id={log.id} onClick={this.getLog}>
                    {log.job}
                      </td>
                  <td>{(new Date(log.date)).toLocaleString()}</td>
                </tr>
               {// todo selected article
                 log.id in selectLogs
                   ? <tr>
                    {selectLogs[log.id].loading === true
                      ? <td>
                          <span className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                          </span>
                        </td>
                      : <div><td colSpan="5">
                            <Input type="textarea" className="bktextarea"
                              name="text" rows="15" id="stdout" readOnly
                              value={log.stdout}/>
                          </td>
                        <td colSpan="5">
                            <Input type="textarea" className="bktextarea"
                              name="text" rows="15" id="stderr" readOnly
                              value={log.stderr}/>
                          </td>
                        </div>

                    }
                  </tr>
                   : null
                 // if article.id in this.props.selectArticles.keys()
               }

                </tbody>
             )
           })
           : <tbody><tr><td><span className="spinner-border" role="status">
               <span className="sr-only">Loading...</span></span>
           </td>
           </tr>
         </tbody>
             }
    </table>
  </td>
      </tr>
  </table>
  </div>

    )
  }
}

Main.propTypes = {
  query: PropTypes.object,
  setQuery: PropTypes.func,

  logsList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      stdout: PropTypes.string,
      stderr: PropTypes.string,
      date: PropTypes.string

    })
  ),
  logsLoading: PropTypes.bool,
  logsErrors: PropTypes.object,
  logsTotalCount: PropTypes.number,
  logsNext: PropTypes.string,
  logsPrevious: PropTypes.string,
  logsuri: PropTypes.string,
  selectLogs: PropTypes.object,
  selectErrors: PropTypes.object,
  filterChange: PropTypes.func,
  fetchLogsFullUri: PropTypes.func,
  fetchLogs: PropTypes.func,
  clearLogs: PropTypes.func,
  clear: PropTypes.func,
  fetchSelect: PropTypes.func,
  clearSelect: PropTypes.func
}
