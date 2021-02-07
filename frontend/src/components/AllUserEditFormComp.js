import React, { Component } from 'react'
import _ from 'lodash'
import { FormGroup, Alert, Button, Jumbotron, Form } from 'reactstrap'
import TextInput from './TextInput'
import CheckBoxInput from './CheckBoxInput'
import propTypes from 'prop-types'
import FormButtons from './compFormButtons'
import Choice from './Choice'

export default class Edit extends Component {
  constructor (props) {
    super(props)

    const errors = this.props.errors || {}
    const err_name = errors.username || {}
    const err_email = errors.email || {}
  }

  componentDidMount () {
    this.props.fetchOrgs('ordering=name')
  }

  render () {
    // set idsList, uniqueIds
    const uniqueOrgs = _.uniqBy(this.props.orgs, 'id') || []
    const ids = []
    for (let i = 0; i < uniqueOrgs.length; i++) {
      if (uniqueOrgs[i].id) {
        ids.push(uniqueOrgs[i].id)
      }
    }

    return (
        <Form onSubmit={this.props.onSubmit} >
          <TextInput
            disabled={true}
            name={'username'}
            label={'Username'}
            value={this.props.object.username}
            error={this.err_name} />
          <TextInput
            onChange={this.props.handleChange}
            name={'email'}
            label={'Email'}
            value={this.props.object.email}
            error={this.err_email} />
          <TextInput
            onChange={this.props.handleChange}
            name={'firstname'}
            label={'First Name'}
            value={this.props.object.first_name}
            error={this.err_email} />
           <TextInput
            onChange={this.props.handleChange}
            name={'lastname'}
            label={'Last Name'}
            value={this.props.object.last_name}
            error={this.err_email} />
            <Choice name={'Organization'}
              disabled={false}
              value={this.props.object.organization}
              onChange={this.handleSourceChange}
              noAllValues={true}
              idList={ids}
              uniqueList={uniqueOrgs}
            />
          <CheckBoxInput
            onChange={this.props.handleChange}
            type={'checkbox'}
            name={'isStaff'}
            readOnly
            label={'Is Staff'}
            checked={this.props.object.is_staff} />
          <CheckBoxInput
            onChange={this.props.handleChange}
            type={'checkbox'}
            name={'isIntegrator'}
            readOnly
            label={'Is Integrator'}
            checked={this.props.object.is_integrator} />

          <FormButtons saving={this.props.saving}
                      onSubmit={this.props.onSubmit}
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
  object: propTypes.shape({
    id: propTypes.number,
    name: propTypes.string,
    active: propTypes.bool
  }

  ),
  goBack: propTypes.func,
  onSubmit: propTypes.func
}
