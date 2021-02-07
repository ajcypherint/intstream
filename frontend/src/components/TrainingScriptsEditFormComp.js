import React, { Component } from 'react'
import { Input, FormGroup, Alert, Button, Jumbotron, Form } from 'reactstrap'
import TextInput from './TextInput'
import CheckBoxInput from './CheckBoxInput'
import propTypes from 'prop-types'
import FormButtons from './compFormButtons'

import { ADD, EDIT } from '../util/util'

export default class Edit extends Component {
  constructor (props) {
    super(props)

    const errors = this.props.errors || {}
    const err_name = errors.name || {}
    this.goVersions = this.goVersions.bind(this)
  }

  goVersions (event) {
    this.props.history.push('/train/' + this.props.match.params.id + '/' + this.props.object.name)
  }

  render () {
    return (
        <Form onSubmit={this.props.onSubmit} >
          <FormGroup>
          <TextInput
            onChange={this.props.handleChange}
            name={'name'}
            label={'Name'}
            value={this.props.object.name}
            error={this.err_name} />
         </FormGroup>
          { this.props.state.action !== EDIT
            ? <FormGroup>
              <Input type="file" name="filein" id="FileInput" />
            </FormGroup>
            : null}

          <FormGroup>
         <FormButtons saving={this.props.saving}
                      onSubmit={this.props.onSubmit}
                       goBack={this.props.goBack}/>
         </FormGroup>

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
  state: propTypes.shape({
    action: propTypes.string
  }),
  goBack: propTypes.func,
  onSubmit: propTypes.func
}
