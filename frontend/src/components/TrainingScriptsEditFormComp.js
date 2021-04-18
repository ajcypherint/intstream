import React, { Component } from 'react'
import { Row, Col, Input, FormGroup, Alert, Button, Jumbotron, Form } from 'reactstrap'
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
    this.versions = this.versions.bind(this)
  }

  versions (event) {
    const script = event.target.dataset.script
    const name = event.target.dataset.name
    this.props.history.push('/trainingscriptversions/?job=' + script + '&name=' + name)
  }

  render () {
    const errors = this.props.errors || {}
    const err_name = errors.name || {}
    const object_script = this.props.object.id || ''
    const object_name = this.props.object.name || ''
    const object_active = this.props.object.active || ''
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
         <CheckBoxInput
            onChange={this.props.handleChange}
            type={'checkbox'}
            name={'active'}
            label={'active'}
            readOnly
            checked={object_active} />
          <FormGroup>
              {this.props.state.action === EDIT &&
          <Row>
            <Col>
                <Button data-script={object_script} data-name={object_name}
                  onClick={this.versions} className="button-brand-primary mb-1" size="lg">Versions</Button>
          </Col>
            <Col>
          </Col>
          </Row>
              }

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
