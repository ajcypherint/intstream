import React, { Component } from 'react'
import { Container, Alert, Button, Jumbotron, Form } from 'reactstrap'
import _ from 'lodash'

import PropTypes from 'prop-types'
import Edit from './SourceEditFormComp'
import { SourceLoading } from './sourceLoading'
import { withRouter } from 'react-router-dom'
import { ADD, EDIT } from '../util/util'
import TextInput from './TextInput'
import FormButtons from './compFormButtons'

export default class SettingEdit extends Component {
  constructor (props) {
    super(props)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.goBack = this.goBack.bind(this)
  }

  componentDidMount () {
    // if  EDIT form
    this.props.fetchSettings()
  }

  goBack (event) {
    event.preventDefault() // prevent form submission
    this.props.history.goBack()
  }

  handleInputChange (event) {
    const target = event.target
    const value = target.type ===
        'checkbox'
      ? target.checked
      : target.value
    const name = target.name
    const object_new = Object.assign({}, this.props.settings[0])
    object_new[name] = value
    // this.setState(object:{...object_new}})
    // dispatch object to redux
    this.props.FormUpdate(object_new)
  }

  onSubmit (event) {
    event.preventDefault()
    this.props.setSettings(this.props.settings[0])
  }

  render () {
    const errors = this.props.errors || {}
    const err_key = errors.key
    const err_secret = errors.aws_secret
    const err_region = errors.region
    const err_aws_s3_log_base = errors.aws_s3_log_base
    const err_aws_s3_upload_base = errors.aws_s3_upload_base
    const settings = this.props.settings || []
    const object = settings[0] || {}
    const aws_key = object.aws_key || ''
    const aws_secret = object.aws_secret || ''
    const aws_region = object.aws_region || ''
    const aws_s3_log_base = object.aws_s3_log_base || ''
    const aws_s3_upload_base = object.aws_s3_upload_base || ''

    return (
      <div className="container col-sm-8 offset-sm-2">
      {errors.detail ? <Alert color="danger">{errors.detail}</Alert> : ''}
        <h1>Settings</h1>
      <Form onSubmit={this.onSubmit} >
            <TextInput
          onChange={this.handleInputChange}
          name={'aws_s3_upload_base'}
          label={'AWS Upload base'}
          value={aws_s3_upload_base}
          error={err_aws_s3_upload_base} />

        <TextInput
          onChange={this.handleInputChange}
          name={'aws_s3_log_base'}
          label={'AWS Log base'}
          value={aws_s3_log_base}
          error={err_aws_s3_log_base} />

        <TextInput
          onChange={this.handleInputChange}
          name={'aws_region'}
          label={'AWS Region'}
          value={aws_region}
          error={err_region} />

        <TextInput
          onChange={this.handleInputChange}
          name={'aws_secret'}
          label={'AWS API Secret'}
          value={aws_secret}
          error={err_secret} />

        <TextInput
          onChange={this.handleInputChange}
          name={'aws_key'}
          label={'AWS API Key'}
          value={aws_key}
          error={err_key} />
       </Form>
       <FormButtons saving={this.props.saving}
                      onSubmit={this.onSubmit}
                       goBack={this.goBack}/>

     </div>
    )
  }
};

SettingEdit.propTypes = {
  saving: PropTypes.bool,
  errors: PropTypes.object,
  settings: PropTypes.arrayOf(
    PropTypes.shape({
      aws_key: PropTypes.string,
      aws_secret: PropTypes.string,
      aws_region: PropTypes.string,
      aws_s3_log_base: PropTypes.string,
      aws_s3_upload_base: PropTypes.string
    })),
  fetchSettings: PropTypes.func

}
