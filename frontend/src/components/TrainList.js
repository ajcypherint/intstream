import React, { Component } from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { Label, Alert, Form, Row, Col, Button, FormGroup, Input } from 'reactstrap'
import DatePicker from 'react-datepicker'
import { dateString, NONE, NONEVAL, ASC, DESC, getUniqueTrainListTF } from '../util/util'
import Paginate from './Paginate'

import { changesort } from './ChangeSort'

import TrueFalse from './TrueFalse'
import Choice from './Choice'

export default class Train extends Component {
  constructor (props) {
    super(props)
    this.handleSourceChange = this.handleSourceChange.bind(this)
    this.handleModelChange = this.handleModelChange.bind(this)
    this.handleStartChange = this.handleStartChange.bind(this)
    this.handleEndChange = this.handleEndChange.bind(this)
    this.handleTFChange = this.handleTFChange.bind(this)
    this.updateDate = this.updateDate.bind(this)
    this.paginate = Paginate.bind(this)
    this.changesort = changesort.bind(this)
    this.fetchit = this.fetchit.bind(this)
    this.getArticle = this.getArticle.bind(this)
    this.handleClassifChange = this.handleClassifChange.bind(this)
    this.redirect = this.redirect.bind(this)
  }

  handleTFChange (event) {
    const id = event.target.value
    const newSelections = {
      ...this.props.query,
      trueFalse: id,
      page: 1
    }
    this.props.filterChange(newSelections, this.props.setQuery)
  }

  redirect (event) {
    this.props.history.push('/createmlversion/' + event.target.value)
  }

  // todo remove classification
  handleClassifChange (event) {
    const { articleid, mlmodel, truefalse, id } = event.target.dataset
    // if off then delete the classification
    if (truefalse === 'true') {
      const target = event.target.checked
      if (target) {
        this.props.setClassif(mlmodel, articleid, true, mlmodel)
      } else {
        // remove classification
        this.props.deleteClassification(id, parseInt(articleid, 10),
          mlmodel
        )
      }
    }
    if (truefalse === 'false') {
      const target = event.target.checked
      if (target) {
        this.props.setClassif(mlmodel, articleid, false, mlmodel)
      } else {
        // remove classification
        this.props.deleteClassification(id, parseInt(articleid, 10),
          mlmodel
        )
      }
    }
  }

  handleModelChange (event) {
    event.preventDefault()
    const id = event.target.value
    this.props.clearClassif()
    if (id !== NONEVAL) {
      const newSelections = {
        ...this.props.query,
        mlmodelChosen: id,
        page: 1
      }
      this.props.filterChange(newSelections, this.props.setQuery)
      // todo() ordering add model
    } else {
      this.props.clear() // selections
      this.props.fetchAllMLModels('ordering=name&active=true')
      this.props.clearArticles()
      const selections = {
        ...this.props.query,
        mlmodelChosen: NONEVAL
      }
      this.props.setQuery(selections)
    }
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
      startDate: startDate,
      endDate: endDate,
      page: 1
    }
    this.props.filterChange(newSelections, this.props.setQuery)
  }

  handleSourceChange (event) {
    event.preventDefault()
    // last filter.  do not need to unset others
    const newSelections = {
      ...this.props.query,
      sourceChosen: event.target.value,
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
    const START = new Date()
    START.setHours(0, 0, 0, 0)

    const END = new Date()
    END.setHours(23, 59, 59, 999)

    const trueFalse = this.props.query.trueFalse || ''
    const ordering = this.props.query.ordering || 'title'
    const page = this.props.query.page || 1
    const orderdir = this.props.query.orderdir || ''
    const sourceChosen = this.props.query.sourceChosen || ''
    const mlmodelChosen = this.props.query.mlmodelChosen || ''
    const startDate = this.props.query.startDate || START
    const endDate = this.props.query.endDate || END
    const parent_id = this.props.query.parent_id || ''
    const selections = {
      ...this.props.query,
      ordering: ordering,
      page: page,
      orderdir: orderdir,
      sourceChosen: sourceChosen,
      mlmodelChosen: mlmodelChosen,
      startDate: startDate,
      endDate: endDate,
      parent_id: parent_id,
      trueFalse: trueFalse
    }
    this.props.setQuery(selections)
    this.props.clearClassif()
    this.props.fetchAllMLModels('ordering=name&active=true')
    if (selections.mlmodelChosen === NONEVAL) {
      this.props.clearArticles()
    } else {
      this.props.fetchArticlesAndClassif(selections.mlmodelChosen,
        dateString(
          selections.orderdir,
          selections.ordering,
          selections.sourceChosen,
          selections.page,
          selections.startDate,
          selections.endDate
        ) + '&source__mlmodel=' + selections.mlmodelChosen + '&source__active=true')
    }
  }

  render () {
    const articles = this.props.articlesList || []
    const errors = this.props.articlesErrors || {}
    const classifErrors = this.props.classifErrors || {}
    const selections = this.props.query || {}
    const models = this.props.modelsList || []
    const uniqueSources = _.uniqBy(this.props.sourcesList, 'id')
    const ids = uniqueSources.map(a => a.id.toString()) || []
    const totalcount = this.props.articlesTotalCount || 0
    const next = this.props.articleNext
    const previous = this.props.articlePrevious
    const loading = this.props.articlesLoading
    const selectArticles = this.props.selectArticles || {}
    const classifications = this.props.classif
    const counts = this.props.classifCounts
    const true_pct = (counts.true_count / counts.total) * 100
    const false_pct = (counts.false_count / counts.total) * 100
    // todo; move this to the backend.
    const create_disabled = selections.mlmodelChosen === NONEVAL ||
             true_pct < 20.0 || false_pct < 20.0 || counts.total < 10
    // todo(aj) code uniqueTF, idsTF, filter out nulls just like  model
    const uniqueTF = getUniqueTrainListTF(this.props.sourcesList)
    const idsTF = uniqueTF.map(a => a.id) || []

    return (

      <div className="container mt-2 col-sm-12 " >

        {errors.non_field_errors ? <Alert color="danger">{errors.non_field_errors}</Alert> : ''}
        {classifErrors.non_field_errors ? <Alert color="danger">{JSON.stringify(classifErrors.non_field_errors)}</Alert> : ''}
        <Form>
       <FormGroup>
         <Row>
        <Col sm="3" >
          <label htmlFor={'model_id'}>{'Model'}</label>
           <Input type="select" name="Model" value={selections.mlmodelChosen} id="model_id" onChange={this.handleModelChange}>
                <option value={NONEVAL}>{NONE}</option>
             {
             models.map((model, index) => {
               return (
                <option value={model.id} key={model.id}>{model.name}</option>
               )
             })
             }
           </Input>

        </Col>
        <Col sm="2">
          <label htmlFor={'start_id'}>{'Start Date'}</label>
          <div className = "mb-2 ">
            <DatePicker style={{ width: '100%' }}
              id={'startDate'}
              disabled={selections.mlmodelChosen === NONEVAL}
              selected={selections.startDate}
              onChange={this.handleStartChange} />
          </div>
        </Col>
        <Col sm="2">
          <label htmlFor={'end_id'}>{'End Date'}</label>
          <div className = "mb-2 ">
            <DatePicker style={{ width: '100%' }}
              id={'endDate'}
              selected={selections.endDate}
              disabled={selections.mlmodelChosen === NONEVAL}
              onChange={this.handleEndChange}/>
          </div>
        </Col>
        <Col sm="2">
          <div className = "mb-2 ">
              <FormGroup>
                <Label htmlFor={'Classification'}>{'Classification'}</Label>
                <Input type="select" name={name}
                  value={selections.trueFalse}
                  id={name + '_id'}
                  disabled={selections.mlmodelChosen === NONEVAL}
                  onChange={this.handleTFChange}>
                  {<option value={''}>---</option>}
                    {uniqueTF.map((item) => {
                      return (<option key={item.id}
                        value={item.id}>
                        {item.name}</option>)
                    })
                  }

                 </Input>
                 </FormGroup>
          </div>
        </Col>

         <Col sm="3" >
          <div >
            <Choice name={'Source'}
              prop={'name'}
              onChange={this.handleSourceChange}
              value={selections.sourceChosen}
              idList={ids}
              uniqueList={uniqueSources}
              disabled={selections.mlmodelChosen === NONEVAL}
            />
           </div>

        </Col>

      </Row>
    </FormGroup>
  </Form> {// this MUST be here.  the paginate function will cause page refreshes
  }
    <Row className={'col-sm-8 offset-sm-2'}>
          <Col>
         {this.paginate(totalcount,
           next,
           previous,
           this.fetchit,
           this.props.fetchArticlesFullUri,
           this.props.query,
           this.props.setQuery
         )}
         </Col>
         <Col align="left">
           <font>True: {isFinite(true_pct) ? true_pct.toFixed(1) : ''}%</font>

         </Col>
         <Col align="left">
           <font>False: {isFinite(false_pct) ? false_pct.toFixed(1) : ''}%</font>
         </Col>
         <Col align="left">
           <font>Count: {counts.total}</font>
         </Col>

         <Col align="left">
           <Button className="button-brand-primary mb-1" size="md" value={selections.mlmodelChosen}
             onClick={this.redirect} disabled={create_disabled}>Create </Button>
         </Col>
       </Row>
         <table className={'table table-sm col-sm-8 offset-sm-2'}>
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
             }}>Title</td>
           <td className="hover" onClick={(event) => {
             this.changesort('source__name',
               ASC,
               DESC,
               selections,
               this.props.filterChange,
               this.props.setQuery,
               0
             )
           }}> Source </td>
           <td className="hover" onClick={(event) => {
             this.changesort('upload_date',
               ASC,
               DESC,
               selections,
               this.props.filterChange,
               this.props.setQuery,
               0
             )
           }}>Date</td>
             <td>True</td>
             <td>False</td>
           </tr>
         </thead>
         { !loading
           ? articles.map((article) => {
             return (
                <tbody key={article.id}>
                <tr key={article.id}>
                 <td className="hover" data-id={article.id} onClick={this.getArticle}>
                    {article.title}
                      </td>
                  <td >
                    {article.source.name}
                  </td>
                  <td>{(new Date(article.upload_date)).toLocaleString()}</td>
                  <TrueFalse trueFalse={true}
                    articleId={article.id}
                    classif={classifications}
                    mlModel={selections.mlmodelChosen}
                    handleChange={this.handleClassifChange}/>
                  <TrueFalse trueFalse={false}
                    articleId={article.id}
                    mlModel={selections.mlmodelChosen}
                    classif={classifications}
                    handleChange={this.handleClassifChange}/>

                </tr>
               {// todo selected article
                 article.id in selectArticles
                   ? <tr>
                    {selectArticles[article.id].loading === true
                      ? <td>
                          <span className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                          </span>
                        </td>
                      : <td colSpan="5">
                            <Input type="textarea" className="bktextarea"
                              name="text" rows="15" id="Article" readOnly
                              value={article.clean_text}/>
                          </td>
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
  </div>

    )
  }
}

Train.propTypes = {
  query: PropTypes.object,
  setQuery: PropTypes.func,

  sourcesList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      target: PropTypes.boolean
    })
  ),
  modelsList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    })
  ),
  articlesList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      text: PropTypes.string,
      clean_text: PropTypes.string,
      title: PropTypes.string,
      source: PropTypes.shape({
        name: PropTypes.string
      })

    })
  ),
  articlesLoading: PropTypes.bool,
  articlesErrors: PropTypes.object,
  articlesTotalCount: PropTypes.number,
  articleNext: PropTypes.string,
  articlePrevious: PropTypes.string,
  articleuri: PropTypes.string,
  selectArticles: PropTypes.object,
  selectErrors: PropTypes.object,
  classif: PropTypes.shape(
    {
      id: PropTypes.bool
    }),
  classifErrors: PropTypes.object,
  classifCounts: PropTypes.object,
  filterChange: PropTypes.func,
  fetchAllSources: PropTypes.func,
  fetchAllMLModels: PropTypes.func,
  fetchArticlesFullUri: PropTypes.func,
  fetchArticles: PropTypes.func,
  clearArticles: PropTypes.func,
  clear: PropTypes.func,
  fetchSelect: PropTypes.func,
  clearSelect: PropTypes.func,
  fetchArticlesAndClassif: PropTypes.func,
  deleteClassification: PropTypes.func,
  setClassif: PropTypes.func,
  fetchClassifCounts: PropTypes.func,
  clearClassif: PropTypes.func

}
