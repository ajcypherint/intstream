import React from 'react'
import _ from 'lodash'
import { Input, Alert, Form, Row, Col, FormGroup } from 'reactstrap'
import propTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import '../custom.css'
import { dateString, getUniqueSources, getIds, getUniqueModels } from '../util/util'
import { Children } from './Children'
import Choice from './Choice'

export class Main extends React.Component {
  constructor (props) {
    super(props)
    this.dateString = dateString.bind(this)
    this.handleSourceChange = this.handleSourceChange.bind(this)
    this.handleModelChange = this.handleModelChange.bind(this)
    this.handleStartChange = this.handleStartChange.bind(this)
    this.handleEndChange = this.handleEndChange.bind(this)
    this.updateDate = this.updateDate.bind(this)
    this.handleThresholdChange = this.handleThresholdChange.bind(this)
    this.handleMaxDfChange = this.handleMaxDfChange.bind(this)
    this.handleMinDfChange = this.handleMinDfChange.bind(this)
  }

  handleMaxDfChange (event) {
    // again here we set selections then fetch
    const newSel = {
      parent_id: '',
      parentMatch: [],
      child: {},
      maxDf: event.target.value,
      page: 1
    }
    const selections = {
      ...this.props.query,
      ...newSel
    }
    this.props.filterChange(selections, this.props.setQuery)
  }

  handleMinDfChange (event) {
    // again here we set selections then fetch
    const newSel = {
      parent_id: '',
      parentMatch: [],
      child: {},
      minDf: event.target.value,
      page: 1
    }
    const selections = {
      ...this.props.query,
      ...newSel
    }
    this.props.filterChange(selections, this.props.setQuery)
  }

  handleThresholdChange (event) {
    // again here we set selections then fetch
    const newSel = {
      parent_id: '',
      parentMatch: [],
      child: {},
      page: 1,
      threshold: event.target.value
    }
    const selections = {
      ...this.props.query,
      ...newSel
    }
    this.props.filterChange(selections, this.props.setQuery)
    this.props.clearParent()
  }

  handleStartChange (date) {
    const selections = this.props.query
    this.updateDate(date, selections.endDate, true)
    this.props.clearParent()
  }

  handleEndChange (date) {
    const selections = this.props.query
    this.updateDate(selections.startDate, date, false)
    this.props.clearParent()
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

    // Would be simpler to set selections first.
    // then fetchallsources
    // then fetchallarticles
    // using a thunk
    //
    // again here we set selections then fetchAllSources, fetchArticles
    const newSel = {
      parent_id: '',
      parentMatch: [],
      child: {},
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

  handleModelChange (event) {
    const newSel = {
      parent_id: '',
      parentMatch: [],
      child: {},
      modelChosen: event.target.value,
      page: 1
    }
    const selections = {
      ...this.props.query,
      ...newSel
    }
    // again here we set selections then fetch
    this.props.filterChange(selections, this.props.setQuery)
    this.props.clearParent()
  }

  handleSourceChange (event) {
    // again we set selections then fetchArticles
    const newSel = {
      parent_id: '',
      parentMatch: [],
      child: {},
      sourceChosen: event.target.value,
      page: 1
    }
    const selections = {
      ...this.props.query,
      ...newSel
    }
    this.props.filterChange(selections, this.props.setQuery)
    this.props.clearParent()
  }

  render () {
    const selections = this.props.query
    const threshold = selections.threshold || 0
    const articles = this.props.articlesList || []
    const loading = typeof this.props.articlesLoading === 'undefined' ? true : this.props.articlesLoading
    const totalcount = this.props.articlesTotalCount || 0
    const next = this.props.articleNext
    const previous = this.props.articlePrevious
    const errors = this.props.articlesErrors || {}

    const uniqueSources = getUniqueSources(this.props.sourcesList)
    const ids = getIds(uniqueSources)

    const uniqueModels = getUniqueModels(this.props.sourcesList)
    const idsModels = getIds(uniqueModels)

    const threshold_values = []
    for (let i = 100; i >= 0; i -= 5) {
      threshold_values.push(i)
    }
    return (
      <div className="container mt-2 col-sm-12" >
        <Form onSubmit={this.onSubmit} >
          {errors.detail ? <Alert color="danger">{errors.detail}</Alert> : ''}
          {errors.non_field_errors ? <Alert color="danger">{errors.non_field_errors}</Alert> : ''}
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

         <Col sm="2" md="2" lg="3">
          <div >
            <Choice name={'Source'}
              prop={'name'}
              disabled={false}
              value={selections.sourceChosen}
              onChange={this.handleSourceChange}
              idList={ids}
              uniqueList={uniqueSources}
            />
           </div>
        </Col>
        <Col sm="2" md="2" lg="2">
           <div>
             <Choice name={'Model'}
               prop={'name'}
               disabled={false}
               value={selections.modelChosen}
               onChange={this.handleModelChange}
               idList={idsModels}
               uniqueList={uniqueModels}
             />
        </div>
        </Col>
        <Col sm="2" md="2" lg="1">
           <label htmlFor={'threshold'}>{'Max Cluster Dif'}</label>
           <Input type="select" name="threshold" value={threshold} id="threshold_id" onChange={this.handleThresholdChange}>
             {threshold_values.map((value) => {
               return (<option key={value} value={value}>{value}</option>
               )
             }
             )}
           </Input>
        </Col>
        <Col sm="1" md="1" lg="1">
           <label htmlFor={'min_df'}>{'Min Doc Freq'}</label>
           <Input type="select" name="min_df" disabled={threshold === 0}
             value={selections.minDf} id="min_df" onChange={this.handleMinDfChange}>
             {threshold_values.map((value) => {
               return (<option key={value} value={value}>{value}</option>
               )
             }
             )}
           </Input>
        </Col>
        <Col sm="1" md="1" lg="1">
           <label htmlFor={'max_df'}>{'Max Doc Freq'}</label>
           <Input type="select" name="max_df" disabled={threshold === 0}
             value={selections.maxDf} id="max_df" onChange={this.handleMaxDfChange}>
             {threshold_values.map((value) => {
               return (<option key={value} value={value}>{value}</option>
               )
             }
             )}
           </Input>
        </Col>
    </Row>
  </FormGroup>
      </Form>
      <Children
          setQuery={this.props.setQuery}
          query={this.props.query}

          filterChange={this.props.filterChange}

          level={0}
          parent_id = {-1}
          show_children={this.showChildren}

          selectArticles={this.props.selectArticles}
          selectErrors={this.props.selectErrors}
          fetchSelect={this.props.fetchSelect}
          clearSelect={this.props.clearSelect}

          clearParent={this.props.clearParent}
          articlesList={this.props.articlesList}
          articlesLoading={this.props.articlesLoading}
          articleNext={this.props.articleNext}
          articlePrevious={this.props.articlePrevious}
          articlesTotalCount={this.props.articlesTotalCount}
          articleuri={this.props.articleuri}
          fetchArticlesFullUri={this.props.fetchArticlesFullUri}
          history={this.props.history}
          />

      </div>

    )
  }
};

Main.propTypes = {
  articleList: propTypes.array,
  sourcesList: propTypes.array
}
