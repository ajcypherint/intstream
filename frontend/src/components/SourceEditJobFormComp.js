import React, { Component } from 'react'
import _ from 'lodash'
import { FormGroup, Col, Row, Alert, Button, Jumbotron, Form } from 'reactstrap'
import TextInput from './TextInput'
import CheckBoxInput from './CheckBoxInput'
import DropDown from './Choice'
import propTypes from 'prop-types'
import FormButtons from './compFormButtons'
import { ADD, EDIT, getIds } from '../util/util'
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

  logs (event) {
    event.preventDefault() // prevent form submission
    const job = event.target.dataset.job
    const name = event.target.dataset.name
    this.props.history.push('/jobloglist/?job=' + job + '&name=' + name)
  }

  versions (event) {
    event.preventDefault() // prevent form submission
    const job = event.target.dataset.job
    const name = event.target.dataset.name
    this.props.history.push('/jobversions/?job=' + job + '&name=' + name)
  }

  render () {
    const errors = this.props.errors || {}
    const err_name = errors.name
    const err_python_version = errors.python_version
    const err_arguments = errors.arguments
    const err_cron_day_of_week = errors.cron_day_of_week
    const err_cron_day_of_month = errors.cron_day_of_month
    const err_cron_month_of_year = errors.cron_month_of_year
    const err_cron_hour = errors.cron_hour
    const err_cron_minute = errors.cron_minute
    const err_user = errors.user
    const err_server_url = errors.server_url
    const err_timeout = errors.timeout
    const object_job = this.props.object.id || ''
    const object_name = this.props.object.name || ''
    const object_arguments = this.props.object.arguments || ''
    const object_cron_day_of_week = this.props.object.cron_day_of_week || ''
    const object_cron_day_of_month = this.props.object.cron_day_of_month || ''
    const object_cron_month_of_year = this.props.object.cron_month_of_year || ''
    const object_cron_hour = this.props.object.cron_hour || ''
    const object_cron_minute = this.props.object.cron_minute || ''
    const object_timeout = this.props.object.timeout || ''
    const object_active = this.props.object.active || ''
    const object_server_url = this.props.object.server_url || 'http://127.0.0.1:8000/'
    const userDropDownInfo = this.props.dropDown[ORG_USER_INFO_KEY] || {}
    const userDropDownResults = userDropDownInfo.results || []
    const object_user = _.filter(userDropDownResults, { id: parseInt(this.props.object.user) })
    const user_id = object_user.length > 0 && object_user[0].id

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
          <TextInput
            onChange={this.props.handleChange}
            name={'arguments'}
            label={'arguments'}
            value={object_arguments}
            error={err_arguments} />
          <TextInput
            onChange={this.props.handleChange}
            name={'cron_day_of_week'}
            label={'cron_day_of_week'}
            value={object_cron_day_of_week}
            error={err_cron_day_of_week} />
          <TextInput
            onChange={this.props.handleChange}
            name={'cron_day_of_month'}
            label={'cron_day_of_month'}
            value={object_cron_day_of_month}
            error={err_cron_day_of_month} />
          <TextInput
            onChange={this.props.handleChange}
            name={'cron_month_of_year'}
            label={'cron_month_of_year'}
            value={object_cron_month_of_year}
            error={err_cron_month_of_year} />

          <TextInput
            onChange={this.props.handleChange}
            name={'cron_hour'}
            label={'cron_hour'}
            value={object_cron_hour}
            error={err_cron_hour} />
          <TextInput
            onChange={this.props.handleChange}
            name={'cron_minute'}
            label={'cron_minute'}
            value={object_cron_minute}
            error={err_cron_minute} />
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
              {this.props.state.action === EDIT &&
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
              }

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
  goBack: propTypes.func,
  onSubmit: propTypes.func
}
