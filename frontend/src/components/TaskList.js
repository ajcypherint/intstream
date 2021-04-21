import React, { Component } from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { Alert, Form, Row, Col, Button, FormGroup, Input } from 'reactstrap'
import DatePicker from 'react-datepicker'
import { dateString, NONE, NONEVAL, ASC, DESC } from '../util/util'
import Paginate from './Paginate'

import { changesort } from './ChangeSort'

import Choice from './Choice'

export default class Main extends Component {
  constructor (props) {
    super(props)
    this.handleStartChange = this.handleStartChange.bind(this)
    this.handleEndChange = this.handleEndChange.bind(this)
    this.updateDate = this.updateDate.bind(this)
    this.paginate = Paginate.bind(this)
    this.changesort = changesort.bind(this)
    this.fetchit = this.fetchit.bind(this)
    this.getLog = this.getLog.bind(this)
    this.getTask = this.getTask.bind(this)
    this.back = this.back.bind(this)
  }

  back (event) {
    this.props.history.goBack()
  }

  getTask (event) {

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
      startDate: startDate,
      endDate: endDate,
      page: 1
    }
    this.props.filterChange(newSelections, this.props.setQuery)
  }

  getLog (event) {
    const { id } = event.target.dataset
    this.props.clearSelect()
    this.props.fetchSelect(id)
    const newSelections = {
      ...this.props.query,
      choice: parseInt(id)
    }
    this.props.setQuery(newSelections)
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
    const START = new Date()
    START.setHours(0, 0, 0, 0)

    const END = new Date()
    END.setHours(23, 59, 59, 999)

    const task = this.props.query.task || ''
    const taskName = this.props.query.taskName || ''
    const ordering = this.props.query.ordering || 'title'
    const page = this.props.query.page || 1
    const orderdir = this.props.query.orderdir || ''
    const startDate = this.props.query.startDate || START
    const endDate = this.props.query.endDate || END
    const choice = this.props.query.choice || 0

    const selections = {
      startDate: startDate,
      endDate: endDate,
      taskName: taskName,
      task: task,
      ordering: ordering,
      page: page,
      orderdir: orderdir,
      choice: choice,
      ...this.props.query
    }
    this.props.filterChange(selections, this.props.setQuery)
  }

  handleStartChange (date) {
    const selections = this.props.query
    this.updateDate(date, selections.endDate, true)
  }

  handleEndChange (date) {
    const selections = this.props.query
    this.updateDate(selections.startDate, date, false)
  }

  render () {
    const logs = this.props.logsList || []
    const errors = this.props.logsErrors || {}
    const selections = this.props.query || {}
    const totalcount = this.props.logsTotalCount || 0
    const next = this.props.logNext
    const previous = this.props.logPrevious
    const loading = this.props.logsLoading
    // todo; move this to the backend.
    return (

      <div className="container mt-2 col-sm-12 " >
        <Form onSubmit={this.onSubmit} >
          {errors.detail && <Alert color="danger">{errors.detail}</Alert> }
          {errors.non_field_errors && <Alert color="danger">{errors.non_field_errors}</Alert> }
       <FormGroup>
       <Row>
        <Col sm="2" md="2" lg="2">
          <label htmlFor={'start_id'}>{'Start Date'}</label>
          <div className = "mb-2 ">
          <DatePicker style={{ width: '100%' }} id={'startDate'} selected={selections.startDate} onChange={this.handleStartChange} />
          </div>
        </Col>
        <Col sm="2" md="2" lg="2">
          <label htmlFor={'end_id'}>{'End Date'}</label>
          <div className = "mb-2 ">
          <DatePicker id={'endDate'} selected={selections.endDate} onChange={this.handleEndChange}/>
          </div>
        </Col>
      </Row>
      </FormGroup>
      </Form>
    <table className="table">
      <tr>
        <td>
          <Button onClick={this.back} className="button-brand-primary mb-1" size="md">Back</Button>
        </td>
      </tr>
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
           <td> Task ID </td>
             <td className="hover" onClick={(event) => {
               this.changesort('Date',
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
                    {log.id}
                 </td>
                 <td className="hover" data-id={log.task_id} onClick={this.getTask}>
                   {log.task_id}
                 </td>
                 <td>{(new Date(log.date)).toLocaleString()}</td>
                </tr>
                { log.id === this.props.query.choice &&
                 <tr>
                   <td colSpan={'3'}>
                     <Input type="textarea" className="bktextarea"
                        name="text" rows="15" id="stdout" readOnly
                        value={log.stderr}/>
                   </td>
                  </tr>
               }
                { log.id === this.props.query.choice &&
                 <tr>
                   <td colSpan={'3'}>
                     <Input type="textarea" className="bktextarea"
                        name="text" rows="15" id="stdout" readOnly
                        value={log.stdout}/>
                   </td>
                  </tr>
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
  logsList: PropTypes.array,
  logsLoading: PropTypes.bool,
  logsErrors: PropTypes.object,
  logsTotalCount: PropTypes.number,
  logsNext: PropTypes.string,
  logsPrevious: PropTypes.string,
  logsuri: PropTypes.string,
  filterChange: PropTypes.func,
  fetchLogsFullUri: PropTypes.func,
  fetchLogs: PropTypes.func,
  clearLogs: PropTypes.func,
  clear: PropTypes.func,
  fetchSelect: PropTypes.func,
  clearSelect: PropTypes.func
}
