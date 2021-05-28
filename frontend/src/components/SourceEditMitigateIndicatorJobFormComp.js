import React, { Component } from 'react'
import { Label, FormFeedback, Row, FormGroup, Col, Alert, Button, Jumbotron, Form } from 'reactstrap'
import TextInput from './TextInput'
import CheckBoxInput from './CheckBoxInput'
import propTypes from 'prop-types'
import _ from 'lodash'
import { getIds } from '../util/util'

import DropDown from './Choice'
import FormButtons from './compFormButtons'
import { ORG_USER_INFO_API, ORG_USER_INFO_KEY } from '../containers/api'

export default class Edit extends Component {
  constructor (props) {
    super(props)
    this.versions = this.versions.bind(this)
    this.logs = this.logs.bind(this)
  }

  componentDidMount () {
    this.props.fetchOrgUserInfo(ORG_USER_INFO_API, '', ORG_USER_INFO_KEY)
  }

  versions (event) {
    event.preventDefault() // prevent form submission
    const job = event.target.dataset.job
    const name = event.target.dataset.name
    this.props.history.push('/indjobversions/?job=' + job + '&name=' + name)
  }

  logs (event) {
    event.preventDefault() // prevent form submission
    const job = event.target.dataset.job
    const name = event.target.dataset.name
    this.props.history.push('/indjobloglist/?job=' + job + '&name=' + name)
  }

  render () {
    const errors = this.props.errors || {}
    const err_server_url = errors.server_url
    const err_name = errors.name
    const err_python_version = errors.python_version
    const err_arguments = errors.arguments
    const err_user = errors.user
    const err_ind_type = errors.indicator_type
    const err_timeout = errors.timeout
    const object_job = this.props.object.id || ''
    const object_name = this.props.object.name || ''
    const object_arguments = this.props.object.arguments || ''
    const object_indicator_type = this.props.object.indicator_type || ''
    const object_timeout = this.props.object.timeout || ''
    const object_active = this.props.object.active || ''
    const indicatorTypes = this.props.indicatorTypes || []
    const object_server_url = this.props.object.server_url || 'http://127.0.0.1:8000/'
    const userDropDownInfo = this.props.dropDown[ORG_USER_INFO_KEY] || {}
    const userDropDownResults = userDropDownInfo.results || []
    const object_user = _.filter(userDropDownResults, { id: parseInt(this.props.object.user) })
    const user_id = object_user.length > 0 && object_user[0].id

    const indicatorIds = getIds(indicatorTypes)
    for (var i = 0; i < indicatorIds.length; i++) indicatorIds[i] = parseInt(indicatorIds[i], 10)

    const userDropDownError = errors.user
    let user_id_list = getIds(userDropDownResults)
    user_id_list = user_id_list.map(function (b, i) {
      return i ? Number(b) : b
    })

    return (
        <Form onSubmit={this.props.onSubmit} >
          {errors.detail ? <Alert color="danger">{errors.detail}</Alert> : ''}
          {errors.non_field_errors ? <Alert color="danger">{errors.non_field_errors}</Alert> : ''}
          <TextInput
            onChange={this.props.handleChange}
            name={'name'}
            label={'Name'}
            value={object_name}
            error={err_name} />
          <DropDown
            name={'indicator_type'}
            error={err_ind_type}
            value={object_indicator_type}
            onChange={this.props.handleChange}
            idList={indicatorIds}
            uniqueList={indicatorTypes}
            disabled={false}
                   />
          <TextInput
            onChange={this.props.handleChange}
            name={'arguments'}
            label={'arguments'}
            value={object_arguments}
            error={err_arguments} />
           <DropDown
            name={'user'}
            error={userDropDownError}
            value={user_id}
            onChange={this.props.handleChange}
            idList={user_id_list}
            prop={'username'}
            uniqueList={userDropDownResults}
            disabled={false}
          />
           <TextInput
            onChange={this.props.handleChange}
            name={'timeout'}
            label={'timeout'}
            value={object_timeout}
            error={err_timeout} />

           <TextInput
            onChange={this.props.handleChange}
            name={'server_url'}
            label={'server_url'}
            value={object_server_url}
            error={err_server_url} />

          <CheckBoxInput
            onChange={this.props.handleChange}
            type={'checkbox'}
            name={'active'}
            label={'active'}
            readOnly
            checked={object_active} />
          <Row>
            <Col>
            <Button data-job={object_job} data-name={object_name}
              onClick={this.versions} className="button-brand-primary mb-1" size="lg">Versions</Button>
          </Col>
            <Col>
            <Button data-job={object_job} data-name={object_name}
              onClick={this.logs} className="button-brand-primary mb-1" size="lg">Logs</Button>
          </Col>
          </Row>

          <FormButtons saving={this.props.saving}
                       goBack={this.props.goBack}/>
          </Form>
    )
  }
};

Edit.propTypes = {
  handleChange: propTypes.func,
  error: propTypes.object,
  saving: propTypes.bool,
  updating: propTypes.bool,
  object: propTypes.object,
  indicatorTypes: propTypes.array,
  goBack: propTypes.func,
  onSubmit: propTypes.func
}
