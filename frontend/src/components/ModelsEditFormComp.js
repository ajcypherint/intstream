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
    //todo; bring in all sources;
    //create list of sources ids already linked.
 }
  componentDidMount(){
    this.props.fetchAllSources()

  }
    render(){
      const sources = this.props.object.sources || []
      const selected_ids = sources.map(source=>source.id)
      const all_sources = this.props.allSources || []
      all_sources.sort((a, b) => (a.name> b.name) ? 1 : -1)
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
          <FormGroup>
            <div className="boxes">
          {
            all_sources.map((source)=>{
              return (
                <div >
          <CheckBoxInput    
            onChange={this.props.handleChange}
            type={'checkbox'} 
            name={source.id}  
            readOnly
            label={source.name}  
            checked={selected_ids.includes(source.id)}   />
 
                </div>
              )

            }

            )

          }
        </div>
        </FormGroup>
          <FormGroup>
          <CheckBoxInput    
            onChange={this.props.handleChange}
            type={'checkbox'} 
            name={'active'}  
            readOnly
            label={'active'}  
            checked={this.props.object.active}   />
        </FormGroup>
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
