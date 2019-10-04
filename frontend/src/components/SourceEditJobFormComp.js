import React, { Component } from 'react';
import {FormGroup, Alert, Button, Jumbotron,  Form } from 'reactstrap';
import TextInput from './TextInput'
import CheckBoxInput from './CheckBoxInput'
import propTypes from 'prop-types'
import FormButtons from './compFormButtons'

export default class Edit extends Component {
  constructor(props){
    super(props)
    const errors = this.props.errors || {}
    const err_name = errors.name || {}
    const err_working_dir = errors.working_dir || {}
    const err_virtual_env_pathh = errors.virtual_env_path || {}
    const err_python_binary_fullpath = errors.python_binary_fullpath || {}
    const err_arguments= errors.arguments || {}
 }
    render(){
      return (
        <Form onSubmit={this.props.onSubmit} >
          <TextInput   
            onChange={this.props.handleChange}
            name={'name'}  
            label={'Name'}  
            value={this.props.object.name}  
            error={this.props.error} />
          <TextInput   
            onChange={this.props.handleChange}
            name={'script_path'}  
            label={'script_path'}  
            value={this.props.object.script_path}  
            error={this.err_name} />
           <TextInput   
            onChange={this.props.handleChange}
            name={'working_dir'}  
            label={'working_dir'}  
            value={this.props.object.working_dir}  
            error={this.err_working_dir} />
            <TextInput   
            onChange={this.props.handleChange}
            name={'virtual_env_path'}  
            label={'virtual_env_path'}  
            value={this.props.object.virtual_env_path}  
            error={this.props.err_virtual_env_path} />
            <TextInput   
            onChange={this.props.handleChange}
            name={'python_binary_fullpath'}  
            label={'python_binary_fullpath'}  
            value={this.props.object.python_binary_fullpath}  
            error={this.props.err_python_binary_fullpath} />
            <TextInput   
            onChange={this.props.handleChange}
            name={'arguments'}  
            label={'arguments'}  
            value={this.props.object.arguments}  
            error={this.props.err_arguments} />
 
          <CheckBoxInput    
            onChange={this.props.handleChange}
            type={'checkbox'} 
            name={'active'}  
            label={'active'}  
            checked={this.props.object.active}   />
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
  object:propTypes.shape({
    id:propTypes.number,
    name:propTypes.string,
    active:propTypes.bool,
  }

  ),
  goBack:propTypes.func,
  onSubmit:propTypes.func
}
