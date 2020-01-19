import React, { Component } from 'react';
import {FormGroup, Alert, Button, Jumbotron,  Form } from 'reactstrap';
import TextInput from './TextInput'
import CheckBoxInput from './CheckBoxInput'
import propTypes from 'prop-types'
import FormButtons from './compFormButtons'

export default class Edit extends Component {
  constructor(props){
    super(props)


  }
  render(){
  const errors = this.props.errors || {}
  const err_key = errors.key || {}
  const err_secret = errors.aws_secret || {}
  const err_region = errors.region || {}
  const err_aws_s3_log_base = errors.aws_s3_log_base || {}
  const err_aws_s3_upload_base = errors.aws_s3_upload_base || {}

  let object = this.props.object || {}
  let aws_key = object.name || ""
  let aws_secret = object.aws_secret || ""
  let aws_region = object.aws_region || ""
  let aws_s3_log_base = object.aws_s3_log_base || ""
  let aws_s3_upload_base = object.aws_s3_upload_base || ""

    return (
      <Form onSubmit={this.props.onSubmit} >
        <TextInput   
          onChange={this.props.handleChange}
          name={'aws_upload_base'}  
          label={'AWS Upload base'}  
          value={aws_s3_upload_base}  
          error={err_aws_s3_upload_base} />
 
        <TextInput   
          onChange={this.props.handleChange}
          name={'aws_log_base'}  
          label={'AWS Log base'}  
          value={aws_s3_log_base}  
          error={err_aws_s3_log_base} />
 
        <TextInput   
          onChange={this.props.handleChange}
          name={'aws_region'}  
          label={'AWS Region'}  
          value={aws_region}  
          error={err_region} />
 
        <TextInput   
          onChange={this.props.handleChange}
          name={'aws_key'}  
          label={'AWS API Key'}  
          value={aws_key}  
          error={err_key} />
 
        <TextInput   
          onChange={this.props.handleChange}
          name={'aws_secret'}  
          label={'AWS API Secret'}  
          value={aws_secret}  
          error={err_secret} />
 
        <TextInput   
          onChange={this.props.handleChange}
          name={'aws_key'}  
          label={'AWS API Key'}  
          value={aws_key}  
          error={err_key} />
       <FormButtons saving={this.props.saving}
                    onSubmit={this.props.onSubmit}
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
  object:propTypes.shape({
    id:propTypes.number,
    name:propTypes.string,
    active:propTypes.bool,
  }

  ),
  goBack:propTypes.func,
  onSubmit:propTypes.func
}
