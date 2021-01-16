import React, { Component } from 'react';
import {FormGroup, Col, Alert, Button, Jumbotron,  Form } from 'reactstrap';
import TextInput from './TextInput'
import CheckBoxInput from './CheckBoxInput'
import propTypes from 'prop-types'
import FormButtons from './compFormButtons'

export default class Edit extends Component {
  constructor(props){
    super(props)
    const errors = this.props.errors || {}
    const err_name = errors.name || {}
    const err_python_version = errors.python_version || {}
    const err_arguments = errors.arguments || {}
    const err_cron_day_of_week = errors.cron_day_of_week || {}
    const err_cron_day_of_month = errors.cron_day_of_month || {}
    const err_cron_month_of_year = errors.cron_month_of_year || {}
    const err_cron_hour = errors.cron_hour || {}
    const err_cron_minute = errors.cron_minute || {}
    const err_user = errors.user || {}
    const err_password = errors.password || {}
    const err_timeout = errors.timeout || {}
    const versions = this.versions.bind(this)
 }
  versions(event){
    event.preventDefault() //prevent form submission
    this.props.history.push("/jobversion/")

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
            name={'python_version'}  
            label={'python_version'}  
            value={this.props.object.script_path}  
            error={this.err_name} />
           <TextInput   
            onChange={this.props.handleChange}
            name={'arguments'}  
            label={'arguments'}  
            value={this.props.object.working_dir}  
            error={this.err_working_dir} />
            <TextInput   
            onChange={this.props.handleChange}
            name={'cron_day_of_week'}  
            label={'cron_day_of_week'}  
            value={this.props.object.cron_day_of_week}  
            error={this.props.err_cron_day_of_week} />
            <TextInput   
            onChange={this.props.handleChange}
            name={'cron_day_of_month'}  
            label={'cron_day_of_month'}  
            value={this.props.object.cron_day_of_month}  
            error={this.props.err_cron_day_of_month} />
            <TextInput   
            onChange={this.props.handleChange}
            name={'cron_hour'}  
            label={'cron_hour'}  
            value={this.props.object.cron_hour}  
            error={this.props.err_cron_hour} />
            <TextInput   
            onChange={this.props.handleChange}
            name={'cron_minute'}  
            label={'cron_minute'}  
            value={this.props.object.cron_minute}  
            error={this.props.err_cron_minute} />
 
           <TextInput   
            onChange={this.props.handleChange}
            name={'user'}  
            label={'user'}  
            value={this.props.object.user}  
            error={this.props.err_user} />
           <TextInput   
            onChange={this.props.handleChange}
            name={'password'}  
            label={'password'}  
            value={this.props.object.password}  
            error={this.props.err_password} />
           <TextInput   
            onChange={this.props.handleChange}
            name={'timeout'}  
            label={'timeout'}  
            value={this.props.object.timeout}  
            error={this.props.err_timeout} />
 
          <CheckBoxInput    
            onChange={this.props.handleChange}
            type={'checkbox'} 
            name={'active'}  
            label={'active'}  
            readOnly
            checked={this.props.object.active}   />
          <FormGroup>
            <Button  onClick={this.versions} className="button-brand-primary mb-1" size="lg">Versions</Button>
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
  object:propTypes.shape({
    id:propTypes.number,
    name:propTypes.string,
    active:propTypes.bool,
  }

  ),
  goBack:propTypes.func,
  onSubmit:propTypes.func
}
