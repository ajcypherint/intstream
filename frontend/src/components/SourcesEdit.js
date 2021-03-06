import React, { Component } from 'react'
import { Container, Alert, Button, Jumbotron, Form } from 'reactstrap'
import _ from 'lodash'

import propTypes from 'prop-types'
import Edit from './SourceEditFormComp'
import { SourceLoading } from './sourceLoading'
import { withRouter } from 'react-router-dom'
import { getOpts, dateString, ADD, EDIT } from '../util/util'

import { PAGINATION, MULTIPARTFORM, JSONFORM } from '../actions/util'
class SourcesEdit extends Component {
  constructor (props) {
    super(props)
    this.state = this.props.state
    this.handleInputChange = this.handleInputChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.goBack = this.goBack.bind(this)
  }

  componentDidMount () {
    // if  EDIT form
    this.props.fetchIndicatorTypes()
    if (typeof this.props.match.params.id !== 'undefined') {
      this.props.fetchSources('id=' + this.props.match.params.id)
    } else {
      // ADD
      this.props.clearSources()
      this.props.sourceFormUpdate(this.props.empty)
    }
  }

  goBack (event) {
    event.preventDefault() // prevent form submission
    this.props.history.goBack()
  }

  handleInputChange (event) {
    const target = event.target
    let value
    if (target.type === 'checkbox') {
      value = target.checked
    } else if (target.type === 'select-multiple') {
      value = getOpts(event)
    } else {
      value = target.value
    }

    const name = target.name
    let object_new = Object.assign({}, this.props.sources[0])
    object_new = {
      ...object_new,
      ...event.target.dataset
    }
    const files = event.target.files || []
    if (files.length > 0) {
      object_new[name] = event.target.files[0]
    } else {
      object_new[name] = value
    }

    // this.setState(object:{...object_new}})
    // dispatch object to redux
    this.props.sourceFormUpdate(object_new)
  }

  onSubmit (event) {
    event.preventDefault()
    const contentTypeNode = event.target.attributes['data-contenttype'] || {}
    const contentType = contentTypeNode.nodeValue || JSONFORM
    if (this.state.action === EDIT) {
      this.props.setSources(this.props.sources[0].id + '/', this.props.sources[0])
    } else {
      this.props.addSources('',
        this.props.sources[0],
        'POST',
        this.props.history.goBack,
        contentType

      )
    }
  }

  render () {
    const loading = this.props.loading
    const error = this.props.errors || {}
    const source = this.props.sources[0] || {}

    const prefix = this.state.action === EDIT ? EDIT : ADD
    const heading = prefix + this.props.heading

    return (
       <div className="row" >
        <div className="col-sm-4"/>
        <div className="col-sm-4">
             <Container>

               <h1>{heading}</h1>
               {error.detail ? <Alert color="danger">{error.detail}</Alert> : ''}
               {React.cloneElement(this.props.form,
                 {
                   object: source,
                   fetchUserInfo: this.props.fetchUserInfo,
                   onSubmit: this.onSubmit,
                   handleChange: this.handleInputChange,
                   errors: error,
                   indicatorTypes: this.props.indicatorTypes,
                   saving: this.props.saving,
                   state: this.props.state,
                   query: this.props.query,
                   goBack: this.goBack,
                   dropDown: this.props.dropDown,
                   ...this.props

                 }
               )
              }
              </Container>
        </div>
        <div className="col-sm-4"/>
      </div>
    )
  }
};

SourcesEdit.propTypes = {
  dropDown: propTypes.object,
  heading: propTypes.string,
  errors: propTypes.object,
  source: propTypes.object,
  indicatorTypes: propTypes.array,
  loading: propTypes.bool,
  match: propTypes.object,
  fetchSources: propTypes.func,
  clearSources: propTypes.func
}

export default withRouter(SourcesEdit)
