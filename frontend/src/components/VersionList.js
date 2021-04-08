import React, { Component } from 'react'
import _ from 'lodash'
import { Alert, Form, Row, Col, Button, FormGroup, Label, Input } from 'reactstrap'
import Choice from './Choice'
import { withRouter } from 'react-router-dom'
import Paginate from './Paginate'
import { ASC, DESC, ALL } from '../util/util'
import { changesort } from './ChangeSort'
import propTypes from 'prop-types'

class VersionList extends Component {
  constructor (props) {
    super(props)
    this.fetch = this.fetch.bind(this)
    this.paginate = Paginate.bind(this)
    this.handleActiveChange = this.handleActiveChange.bind(this)
    this.onRefresh = this.onRefresh.bind(this)
    this.changesort = changesort.bind(this)
  }

  componentDidMount () {
    const selections = this.props.query
    const job = this.props.query.job || ''
    const ordering = this.props.query.ordering || 'id'
    const page = this.props.query.page || 1
    const orderdir = this.props.query.orderdir || ''
    const newSel = {
      ...selections,
      job: job,
      ordering: ordering,
      page: page,
      orderdir: orderdir
    }

    this.props.filterChange(
      newSel, this.props.setQuery
    )
  }

  handleActiveChange (event) {
    const { model, id } = event.target.dataset
    this.props.setActiveVersion(model,
      id,
      this.props.query,
      this.props.setQuery)
  }

  onRefresh (event) {
    event.preventDefault()
    this.props.filterChange(this.props.query, this.props.setQuery)
  }

  fetch (selections, page) {
    const newSelections = {
      ...selections,
      page: page
    }
    this.props.filterChange(newSelections, this.props.setQuery)
  }

  render () {
    const id = this.props.query.id || undefined
    const name = this.props.query.name || undefined
    const totalcount = this.props.VersionTotalCount
    const errors = this.props.VersionErrors || {}
    const next = this.props.VersionNext
    const previous = this.props.VersionPrevious
    const loading = typeof this.props.VersionLoading === 'undefined' ? true : this.props.VersionLoading
    const VersionList = this.props.VersionList || []

    return (
     <div className="container mt-2 col-sm-12 " >

          {errors.non_field_errors ? <Alert color="danger">{errors.non_field_errors}</Alert> : ''}
          <Form>
            <FormGroup className={'col-sm-8 offset-sm-2'}>
              <Row>
                <Col colSpan={4}>
                  {name && <h2>{name}</h2>}
                </Col>
              </Row>
           </FormGroup>
          </Form>
        <Row className={'col-sm-8 offset-sm-2'}>
        <table className={'table table-sm'}>
          <tbody>
            <tr>
              <td>
             {this.paginate(totalcount,
               next,
               previous,
               this.fetch,
               this.props.fetchVersions,
               this.props.query,
               this.props.setQuery)}
             </td>
           </tr>
           <tr>
             <td>
               {React.cloneElement(this.props.table,
                 {
                   VersionList: this.props.VersionList,
                   VersionLoading: this.props.VersionLoading,
                   query: this.props.query,
                   history: this.props.history,
                   List: this.props.List,
                   filterChange: this.props.filterChange,
                   setQuery: this.props.setQuery,
                   handleActiveChange: this.handleActiveChange,
                   setPage: this.props.setPage,
                   changesort: this.changesort,
                   parentUri: this.props.parentUri,
                   addUri: this.props.addUri

                 }
               )
                }

             </td>
            </tr>
          </tbody>
        </table>
        </Row>
      </div>
    )
  }
}

VersionList.propTypes = {
  List: propTypes.arrayOf(propTypes.shape(

  )),
  VersionList: propTypes.arrayOf(propTypes.object),
  VersionLoading: propTypes.bool,
  VersionErrors: propTypes.object,
  VersionTotalCount: propTypes.number,
  VersionNext: propTypes.string,
  VersionPrevious: propTypes.string,

  filterChange: propTypes.func,
  fetchVersions: propTypes.func,
  setPage: propTypes.func,
  setActiveVersion: propTypes.func,
  parentIdentifier: propTypes.string,
  parentUri: propTypes.string

}

export default withRouter(VersionList)
