import React, { Component } from 'react';
import {FormGroup, Col, Alert, Button, Jumbotron,  Form } from 'reactstrap';
import TextInput from './TextInput'
import CheckBoxInput from './CheckBoxInput'
import propTypes from 'prop-types'
import _ from 'lodash';

import Choice from "./MultiChoiceColIds"
import FormButtons from './compFormButtons'

export default class Edit extends Component {
  constructor(props){
    super(props)
   this.versions = this.versions.bind(this)
 }
  versions(event){
    event.preventDefault() //prevent form submission
    let id = event.target.dataset.id
      let name = event.target.dataset.name
    this.props.history.push("/indjobversions/?id=" + id + "&name=" + name)

  }
  render(){
    const errors = this.props.errors || {}
    const err_name = errors.name
    const err_python_version = errors.python_version
    const err_arguments = errors.arguments 
    const err_user = errors.user
    const err_password = errors.password 
    const err_ind_types= errors.ind_types
    const err_timeout = errors.timeout 
    const object_id = this.props.object.id || ""
    const object_name = this.props.object.name || ""
    const object_arguments = this.props.object.arguments || ""
    const object_indicator_types = this.props.object.indicator_types || []
    const object_user = this.props.object.user || ""
    const object_password = this.props.object.password || ""
    const object_timeout = this.props.object.timeout || ""
    const object_active = this.props.object.active || ""
    const indicatorTypes = this.props.indicatorTypes || []
 
      return (
        <Form onSubmit={this.props.onSubmit} >
          {errors.detail?<Alert color="danger">{errors.detail}</Alert>:""}
          {errors.non_field_errors?<Alert color="danger">{errors.non_field_errors}</Alert>:""}
          <TextInput   
            onChange={this.props.handleChange}
            name={'name'}  
            label={'Name'}  
            value={object_name}  
            error={err_name} />
          <Choice multiple={true}
            id={'indtypes'}
            label={'Indicator types'}
            name={"indicator_types"}
            error={err_ind_types}
                    value={object_indicator_types}
                    values={indicatorTypes}
                    onChange={this.props.handleChange}
                    disabled={false}
                   />
 
          <TextInput   
            onChange={this.props.handleChange}
            name={'arguments'}  
            label={'arguments'}  
            value={object_arguments}  
            error={err_arguments} />
           <TextInput   
            onChange={this.props.handleChange}
            name={'user'}  
            label={'user'}  
            value={object_user}  
            error={err_user} />
           <TextInput   
            onChange={this.props.handleChange}
            name={'password'}  
            type={"password"}
            label={'password'}  
            value={object_password}  
            error={err_password} />
           <TextInput   
            onChange={this.props.handleChange}
            name={'timeout'}  
            label={'timeout'}  
            value={object_timeout}  
            error={err_timeout} />
 
          <CheckBoxInput    
            onChange={this.props.handleChange}
            type={'checkbox'} 
            name={'active'}  
            label={'active'}  
            readOnly
            checked={object_active}   />
          <FormGroup>
            <Button  data-id={object_id} data-name={object_name}
              onClick={this.versions} className="button-brand-primary mb-1" size="lg">Versions</Button>
          </FormGroup>
 
          <FormButtons saving={this.props.saving}
                       goBack={this.props.goBack}/>
          </Form>
      )
    }
};
 
Edit.propTypes = {
  handleChange:propTypes.func,
  error:propTypes.object,
  saving:propTypes.bool,
  updating:propTypes.bool,
  object:propTypes.object,
  indicatorTypes:propTypes.array,
  goBack:propTypes.func,
  onSubmit:propTypes.func
}