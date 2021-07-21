import React from 'react'
import _ from 'lodash'
import { Input, Alert, Form, Row, Col, FormGroup, Button } from 'reactstrap'
import propTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import '../custom.css'

import { getOpts, getUniqueSources, getIds, dateString, getUniqueModels, ASC, DESC, ALL } from '../util/util'
import Choice from './Choice'

import Indicators from './Indicators'
import Paginate from './Paginate'
export class Main extends React.Component {
  constructor (props) {
    super(props)
    this.dateString = dateString.bind(this)
    this.handleSourceChange = this.handleSourceChange.bind(this)
    this.handleModelChange = this.handleModelChange.bind(this)
    this.handleStartChange = this.handleStartChange.bind(this)
    this.handleEndChange = this.handleEndChange.bind(this)
    this.updateDate = this.updateDate.bind(this)
    this.paginate = Paginate.bind(this)
    this.tabUpdate = this.tabUpdate.bind(this)
    this.fetch = this.fetch.bind(this)
    this.changeColChoice = this.changeColChoice.bind(this)
  }

  handleStartChange (date) {
    const selections = this.props.query
    this.updateDate(date, selections.endDate, true)
  }

  handleEndChange (date) {
    const selections = this.props.query
    this.updateDate(selections.startDate, date, false)
  }

  changeColChoice (event) {
    const type = event.target.dataset.type
    const selected = getOpts(event)
    // if this.props.query.selectedTabIndex != selected.selectedTabIndex:
    // clear numCols, textCols
    const newSel = {
      [type]: selected,
      page: 1
    }
    const selections = {
      ...this.props.query,
      ...newSel
    }
    // again here we set selections then fetch
    // this.props.filterChange(selections, this.props.setQuery)
    this.props.setQuery(selections)
  }

  updateDate (startDate, endDate, start_filter = true) {
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

    // Would be simpler to set selections first.
    // then fetchallsources
    // then fetchallarticles
    // using a thunk
    //
    // again here we set selections then fetchAllSources, fetchArticles
    const newSel = {
      page: 1,
      startDate: startDate,
      endDate: endDate
    }
    const selections = {
      ...this.props.query,
      ...newSel
    }
    this.props.filterChange(selections, this.props.setQuery)
  }

  updateComponent () {
    const START = new Date()
    START.setHours(0, 0, 0, 0)

    const END = new Date()
    END.setHours(23, 59, 59, 999)
    const article = this.props.query.article || ''
    const ordering = this.props.query.ordering || 'value'
    const page = this.props.query.page || 1
    const orderdir = this.props.query.orderdir || ''
    const sourceChosen = this.props.query.sourceChosen || ''
    const modelChosen = this.props.query.modelChosen || ''
    const startDate = this.props.query.startDate || START
    const endDate = this.props.query.endDate || END
    const next = this.props.query.next || ''
    const previous = this.props.query.previous || ''
    const selectedTabIndex = this.props.query.selectedTabIndex || 'md5'
    const selectedTabIndexNum = this.props.query.selectedTabIndexNum || 0
    const numCols = this.props.query.numCols || []
    const textCols = this.props.query.textCols || []
    // todo: check if intersection of selected cols and possible cols
    const numColsObjs = this.props.numCols
    const textColsObjs = this.props.textCols
    const numColsList = []

    const selections = {
      article: article,
      ordering: ordering,
      page: page,
      orderdir: orderdir,
      sourceChosen: sourceChosen,
      modelChosen: modelChosen,
      startDate: startDate,
      endDate: endDate,
      next: next,
      previous: previous,
      selectedTabIndex: selectedTabIndex,
      selectedTabIndexNum: selectedTabIndexNum,
      numCols: numCols,
      textCols: textCols
    }
    this.props.filterChange(selections, this.props.setQuery)
    this.props.fetchMitigateJobVersions('job__indicator_type__name=' + selectedTabIndex.toUpperCase())
  }

  componentDidMount () {
    this.updateComponent()
  }

  componentDidUpdate (prevProps) {
    // Typical usage (don't forget to compare props):
    if (typeof this.props.query.page === 'undefined' && typeof prevProps.query.page !== 'undefined') {
      this.updateComponent()
    }
  }

  handleModelChange (event) {
    const newSel = {
      modelChosen: event.target.value,
      page: 1
    }
    const selections = {
      ...this.props.query,
      ...newSel
    }
    // again here we set selections then fetch
    this.props.filterChange(selections, this.props.setQuery)
  }

  handleSourceChange (event) {
    // again we set selections then fetchArticles
    const newSel = {
      sourceChosen: event.target.value,
      page: 1
    }
    const selections = {
      ...this.props.query,
      ...newSel
    }
    this.props.filterChange(selections, this.props.setQuery)
  }

  tabUpdate (index, lastIndex, event) {
    const newTab = event.target.dataset.value
    const newSel = {
      selectedTabIndex: newTab,
      selectedTabIndexNum: index,
      page: 1
    }
    const selections = {
      ...this.props.query,
      ...newSel
    }
    this.props.filterChange(selections,
      this.props.setQuery
    )
    this.props.fetchMitigateJobVersions('job__indicator_type__name=' + newTab.toUpperCase())
  }

  // parent for paginate
  fetch (selections, page) {
    this.props.filterChange(selections, this.props.setQuery)
  }

  render () {
    const selections = this.props.query
    // todo md5, sha1, sha256, ipv4, netloc, ipv6 errors
    const errors = this.props.indicatorsErrors || {}
    const errorsMd5 = this.props.md5Errors || {}
    const errorsSha1 = this.props.sha1Errors || {}
    const errorsSha256 = this.props.sha256Errors || {}
    const errorsIpv4 = this.props.Ipv4Errors || {}
    const errorsNetLoc = this.props.NetLocErrors || {}
    const errorsIpv6 = this.props.Ipv6Errors || {}
    const errorsColText = this.props.indicatorColTextaErrors || {}
    const errorsColTextData = this.props.indicatorColTextDataErrors || {}
    const errorsColNum = this.props.indicatorColNumErrors || {}
    const errorsColNumData = this.props.indicatorColNumDataErrors || {}

    const uniqueSources = getUniqueSources(this.props.sourcesList)
    const ids = getIds(uniqueSources)

    const uniqueModels = getUniqueModels(this.props.sourcesList)
    const idsModels = getIds(uniqueModels)

    const articleErrors = this.props.articlesErrors || {}
    const articles = this.props.articlesList || []
    const articlesLen = articles.length
    const errorsTotal = [
      errors,
      errorsMd5,
      errorsSha1,
      errorsSha256,
      errorsIpv4,
      errorsNetLoc,
      errorsIpv6,
      errorsColText,
      errorsColTextData,
      errorsColNum,
      errorsColNumData,
      articleErrors
    ]

    return (
    <div className="container mt-2 col-sm-12" >

    { this.props.query.article &&
    <Button onClick={this.props.history.goBack} className="button-brand-primary sb-1" size="sm">Back</Button> }
    <Form onSubmit={this.onSubmit} >
      { errorsTotal.map((i, index) => {
        return (i.detail && <Alert color="danger">{i.detail}</Alert>)
      })}
      { errorsTotal.map((i, index) => {
        return (i.non_field_errors && <Alert color="danger">{i.non_field_errors}</Alert>)
      })}

  { !this.props.query.article
    ? <FormGroup>
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

         <Col sm="2" md="2" lg="3">
            <Choice name={'Source'}
              prop={'name'}
              disabled={false}
              value={selections.sourceChosen}
              onChange={this.handleSourceChange}
              idList={ids}
              uniqueList={uniqueSources}
            />
        </Col>
        <Col sm="2" md="2" lg="2">
             <Choice name={'Model'}
               prop={'name'}
               disabled={false}
               value={selections.modelChosen}
               onChange={this.handleModelChange}
               idList={idsModels}
               uniqueList={uniqueModels}
             />
        </Col>
     </Row>
   </FormGroup>
    : <div>
        <h3>Source: {articlesLen > 0 && articles[0].source.name}</h3>
        <h4>Title: {articlesLen > 0 && articles[0].title}</h4>
    </div>

  }
  </Form>
      <Indicators
        {...this.props}
        fetchit={this.fetch}
        selections={selections}
        paginate={this.paginate}
        tabUpdate={this.tabUpdate}
        changeColChoice={this.changeColChoice}
      />
  </div>
    )
  }
};

Main.propTypes = {
  sourcesList: propTypes.array,
  indicatorsList: propTypes.array,
  indicatorsLoading: propTypes.bool,
  indicatorsTotalCount: propTypes.number,
  indicatorsNext: propTypes.string,
  indicatorsPrevious: propTypes.string,
  fetchAllSources: propTypes.func,
  filterChange: propTypes.func,
  fetchIndicatorsFullUri: propTypes.func,
  fetchIndicators: propTypes.func,
  md5: propTypes.object,
  sha1: propTypes.object,
  sha256: propTypes.object,
  numColsData: propTypes.array,
  textColsData: propTypes.array

}
