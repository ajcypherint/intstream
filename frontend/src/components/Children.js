import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Input, Table, Alert, Form, Row, Col, FormGroup, Button, ListGroup, ListGroupItem } from 'reactstrap'
import { Link } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import '../custom.css'
import Paginate from './Paginate'
import { PAGINATION, dateString, childString, addDays, ASC, DESC, ALL } from '../util/util'
import { changesort } from './ChangeSort'

import { createParent } from '../reducers/children'
import Match from './Match'

export class Children extends React.Component {
  constructor (props) {
    super(props)
    this.paginate = Paginate.bind(this)
    this.fetch = this.fetch.bind(this)
    this.childFetch = this.childFetch.bind(this)
    this.changesort = changesort.bind(this)
    this.showChildren = this.showChildren.bind(this)
    this.getArticle = this.getArticle.bind(this)
    this.updateComponent = this.updateComponent.bind(this)
    this.showIndicators = this.showIndicators.bind(this)
  }

  showIndicators (event) {
    const { parent, level } = event.target.dataset
    const { id, title, match } = JSON.parse(parent) // {id,title, match}
    const level_int = parseInt(level)
    this.props.history.push('indicatorhome/?article=' + id)
  }

  updateComponent () {
    const START = new Date()
    START.setHours(0, 0, 0, 0)

    const END = new Date()
    END.setHours(23, 59, 59, 999)

    const ordering = this.props.query.ordering || 'title'
    const page = this.props.query.page || 1
    const orderdir = this.props.query.orderdir || ''
    const sourceChosen = this.props.query.sourceChosen || ''
    const modelChosen = this.props.query.modelChosen || ''
    const startDate = this.props.query.startDate || START
    const endDate = this.props.query.endDate || END
    const threshold = this.props.query.threshold || 0
    const minDf = this.props.query.minDf || 0
    const maxDf = this.props.query.maxDf || 80
    const next = this.props.query.next || ''
    const previous = this.props.query.previous || ''
    const parent_id = this.props.query.parent_id || ''
    const parentMatch = this.props.query.parentMatch || []
    const child = this.props.query.child || {}
    const childPage = child.page || 1
    const childOrderDir = child.orderdir || ''
    const childOrdering = child.ordering || 'title'
    const childNew = {
      page: childPage,
      orderdir: childOrderDir,
      ordering: childOrdering
    }

    const selections = {
      ordering: ordering,
      page: page,
      orderdir: orderdir,
      sourceChosen: sourceChosen,
      modelChosen: modelChosen,
      startDate: startDate,
      endDate: endDate,
      threshold: threshold,
      minDf: minDf,
      maxDf: maxDf,
      next: next,
      previous: previous,
      parent_id: parent_id,
      parentMatch: parentMatch,
      child: childNew
    }
    this.props.parent_obj
      ? this.props.filterChange(selections, this.props.setQuery, this.props.parent_obj)
      : this.props.filterChange(selections, this.props.setQuery)
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

  getArticle (event) {
    const { id } = event.target.dataset
    this.props.clearSelect()
    this.props.fetchSelect(id)
  }

  // when click on  similar articles
  showChildren (event) {
    // call fetch for children based on level
    const { parent, level } = event.target.dataset
    const parentobj = JSON.parse(parent) // {id,title, match}
    const level_int = parseInt(level)
    const selections = {
      ...this.props.query,
      parent_id: parentobj.id,
      parentMatch: parentobj.match,
      child: {
        page: 1,
        ordering: 'title',
        orderDir: ''
      }
    }
    this.props.clearParent()
    this.props.filterChange(selections, this.props.setQuery, parentobj)
  }

  // child for paginate
  childFetch (selections, page) {
    this.props.filterChange(selections, this.props.setQuery, this.props.parent_obj)
  }

  // parent for paginate
  fetch (selections, page) {
    this.props.filterChange(selections, this.props.setQuery)
  }

  render () {
    const level = this.props.level || 0

    const selections = this.props.query
    const articles = this.props.articlesList
    const loading = this.props.articlesLoading
    const totalcount = this.props.articlesTotalCount || 0
    const next = this.props.articleNext
    const previous = this.props.articlePrevious
    const errors = this.props.articlesErrors || {}
    const child = this.props.child || {}
    const col_num = level === 0 ? 8 : 11
    const cols = 'col-sm-' + col_num
    const offset_num = level === 0 ? 2 : 1
    const offset = 'offset-sm-' + offset_num
    const page_fetch = level === 0 ? this.fetch : this.childFetch
    const parent_id = this.props.query.parent_id || undefined
    const i = 1
    const selectArticles = this.props.selectArticles || {}
    const parentObj = level === 1
      ? createParent(this.props.query.parent_id,
        this.props.query.parentMatch)
      : undefined
    // add IOC column for each article, count of all iocs as a link to show indicators page
    return (

    <table className={'table table-sm ' + cols + ' ' + offset}>
      <tbody>
        <tr>
          <td>
         {this.paginate(totalcount,
           next,
           previous,
           page_fetch,
           this.props.fetchArticlesFullUri,
           selections,
           this.props.setQuery,
           level === 1)}
         </td>
         </tr>
         <tr>
        <td>
       <table className={'table table-sm'}>
         <thead>
           <tr>
             <td className="hover" onClick={(event) => {
               this.changesort('title',
                 ASC,
                 DESC,
                 selections,
                 this.props.filterChange,
                 this.props.setQuery,
                 level,
                 parentObj
               )
             }}>Title</td>
           <td className="hover" onClick={(event) => {
             this.changesort('source__name',
               ASC,
               DESC,
               selections,
               this.props.filterChange,
               this.props.setQuery,
               level,
               parentObj
             )
           }}> Source </td>
           <td className="hover" onClick={(event) => {
             this.changesort('upload_date',
               ASC,
               DESC,
               selections,
               this.props.filterChange,
               this.props.setQuery,
               level,
               parentObj
             )
           }}>Date</td>
         {level === 0
           ? <td >Similar Articles</td>
           : null}
             <td >Indicators</td>
           </tr>
         </thead>
         { !loading
           ? articles.map((article) => {
             return (
                <tbody key={level + article.id}>
                <tr key={level + article.id}>
                 <td className="hover" data-id={article.id} onClick={this.getArticle}>
                    {article.title}
                      </td>
                  <td >
                    { typeof (article.source) !== 'undefined' && article.source.name }
                  </td>
                  <td>{(new Date(article.upload_date)).toLocaleString()}</td>
                  <td>
                    <Match level={level} article={article} showChildren={this.showChildren}/>
                  </td>
                  <td>
                    <Match level={level} article={article} showChildren={this.showIndicators} field="indicator_set"/>
                  </td>
               </tr>
                  {
                     article.id in selectArticles
                       ? <tr>
                        {selectArticles[article.id].loading === true
                          ? <td>
                              <span className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                              </span>
                            </td>
                          : <td colSpan="6">
                                <Input type="textarea" className="bktextarea"
                                  name="text" rows="15" id="Article" readOnly
                                  value={selectArticles[article.id].data.clean_text}/>
                              </td>
                        }
                      </tr>
                       : null
                   }

                   {
                     article.hasOwnProperty('children') &&
                      <tr>
                        <td colSpan="4">
                          <Children
                            setQuery={this.props.setQuery}
                            query={this.props.query}

                             parent_obj={createParent(article.id, article.match)}
                             selectArticles={this.props.selectArticles}
                             selectErrors={this.props.selectErrors}
                             fetchSelect={this.props.fetchSelect}
                             clearSelect={this.props.clearSelect}
                             filterChange={this.props.filterChange}

                            articlesList={article.children.articles}
                            articlesLoading={article.children.loading}
                            articleNext={article.children.nextpage}
                            articlePrevious={article.children.previouspage}
                            articlesTotalCount={article.children.totalcount}
                            fetchArticlesFullUri={this.props.fetchArticlesFullUri}
                            level={level + 1}
                            history={this.props.history}
                           />
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
    </tbody>
  </table>
    )
  }
}
Children.propTypes = {
  setQuery: PropTypes.func,
  filterChange: PropTypes.func,

  fetchArticlesFullUri: PropTypes.func,
  fetchArticles: PropTypes.func,
  setHomeSelections: PropTypes.func,
  setPage: PropTypes.func,
  clearParent: PropTypes.func,
  show_children: PropTypes.func,

  fetchSelect: PropTypes.func,
  clearSelect: PropTypes.func,

  query: PropTypes.object,
  level: PropTypes.number,
  parent_id: PropTypes.number,
  selectArticles: PropTypes.object,
  selectErrors: PropTypes.object,

  articlesList: PropTypes.arrayOf(PropTypes.object),
  articleNext: PropTypes.string,
  articlePrevious: PropTypes.string,
  articlesTotalCount: PropTypes.number,
  history: PropTypes.object

}
