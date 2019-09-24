import React, { Component } from 'react';
import _ from 'lodash';
import {Container} from 'reactstrap'
import { Alert, Button, Jumbotron,  Form } from 'reactstrap';
import TextInput from './TextInput'
import propTypes from 'prop-types'

class SourcesUploadEdit extends Component {
  constructor(props){
    super(props)
    //this.state={
    //  na:'',
    //}
 
   this.onSubmit = this.onSubmit.bind(this)
  }
  onSubmit(){

  }
  render(){
    const source = this.props.source;
    const loading = this.props.loading;
    const error = this.props.errors;

  return (
       <Container>
            <Form onSubmit={this.onSubmit} >
            {error.detail?<Alert color="danger">{error.detail}</Alert>:""}
            {this.props.fields.map((field) => {
              return (
                <TextInput name={field.name}  label={field.name}  error={error[field.name]} />
              )

            })}
 
            <Button type="submit" className="button-brand-primary" size="lg">Save</Button>
          </Form>
 
        </Container>
  )
  } 
 
};

SourcesUploadEdit.propTypes = {
  errors:propTypes.object,
  source:propTypes.object.isRequired,
  loading:propTypes.object.isRequired,
  fields:propTypes.arrayOf(
    propTypes.string
    ).isRequired

};
