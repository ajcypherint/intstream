import React, { Component } from 'react';
import {Input, FormFeedback, FormGroup, Alert, Button, Jumbotron,  Form } from 'reactstrap';
import TextInput from './TextInput'
import CheckBoxInput from './CheckBoxInput'
import propTypes from 'prop-types'
import FormButtons from './compFormButtons'

import {PAGINATION, MULTIPARTFORM, JSONFORM} from '../actions/util'
import {ADD,EDIT} from '../util/util'

export default class Edit extends Component {
  constructor(props){
    super(props)

  }
 render(){
   const errors = this.props.errors || {}
   const err_version = errors.version
   const err_job= errors.job
   const err_zip= errors.zip ||  []
 
   let name = this.props.query.name || undefined
   let id = this.props.query.id || undefined
   return (
        <Form onSubmit={this.props.onSubmit} >

          <FormGroup>
            {name &&<h1>{name}</h1>}

          <TextInput   
            disabled={true}
            data-job={id}
            name={'job_name'}  
            label={'Job'}  
            value={name}  
            error={undefined} />
 
          <TextInput   
            onChange={this.props.handleChange}
            data-job={id}
            name={'version'}  
            label={'Version'}  
            value={this.props.object.version}  
            error={err_version}
             />
         </FormGroup>
          { this.props.state.action !== EDIT ?
            <FormGroup>

              {err_zip.length > 0 && <Alert color="danger">{err_zip[0]}</Alert>}
              <Input 
                onChange={this.props.handleChange}
                data-job={id}
                label={"Job Tar File"}
                type="file" name="zip" id="FileInput" 
              />
            </FormGroup>: null}
            <FormGroup>
          <CheckBoxInput    
            onChange={this.props.handleChange}
            type={'checkbox'} 
            data-job={id}
            name={'active'}  
            readOnly
            label={'active'}  
            checked={this.props.object.active||false}   />
 
        </FormGroup>
          <FormGroup>
         <FormButtons data-contenttype={MULTIPARTFORM} saving={this.props.saving}
                      onSubmit={this.props.onSubmit}
                       goBack={this.props.goBack}/>
         </FormGroup>
          
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

  state:propTypes.shape({
    action:propTypes.string,
  }),
  goBack:propTypes.func,
  onSubmit:propTypes.func
}
