import React, { Component } from 'react';
import {FormGroup,FormFeedback, Alert, Button, Jumbotron,  Form } from 'reactstrap';
import TextInput from './TextInput'
import CheckBoxInput from './CheckBoxInput'
import propTypes from 'prop-types'
import FormButtons from './compFormButtons'

export default class Edit extends Component {
  constructor(props){
    super(props)
    const errors = this.props.errors || {}
    const err_name = errors.name || {}
    const err_url = errors.url || {}
 }
    render(){
      return (
        <Form onSubmit={this.props.onSubmit} >
          <TextInput   
            onChange={this.props.handleChange}
            name={'name'}  
            label={'Name'}  
            value={this.props.object.name}  
            error={this.err_name} />
          <TextInput   
            onChange={this.props.handleChange}
            name={'url'}  
            label={'Url'}  
            value={this.props.object.url}  
            error={this.err_url} />
 
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
