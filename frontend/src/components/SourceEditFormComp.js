import React, { Component } from 'react';
import { Alert, Button, Jumbotron,  Form } from 'reactstrap';
import TextInput from './TextInput'
import CheckBoxInput from './CheckBoxInput'
import propTypes from 'prop-types'

export default class Edit extends Component {
  constructor(props){
    super(props)
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
          <CheckBoxInput    
            onChange={this.props.handleChange}
            type={'checkbox'} 
            name={'active'}  
            label={'active'}  
            checked={this.props.object.active}   />
            {this.props.saving===true?
               <span className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
               </span>:
               <Button type="submit" className="button-brand-primary" size="lg">Save</Button>
            }
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
  onSubmit:propTypes.func
}
