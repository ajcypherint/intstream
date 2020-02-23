import React, { useState, Component } from 'react';
import {FormGroup,Label, Alert, Button, Jumbotron,  Form } from 'reactstrap';
import TextInput from './TextInput'
import CheckBoxInput from './CheckBoxInput'
import propTypes from 'prop-types'
import FormButtons from './compFormButtons'
import {withRouter} from 'react-router-dom'

export default class Edit extends Component {

  constructor(props){
    super(props)
    this.state={
      show:false,
      visible:false,
    }
   this.handle_source_check = this.handle_source_check.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
    this.handle_train = this.handle_train.bind(this)
    this.onDismiss = this.onDismiss.bind(this)
    //todo; bring in all sources;
    //create list of sources ids already linked.
  }
  handle_train(event){
    this.props.history.push('/train/'+this.props.match.params.id+"/"+this.props.object.name)
  }
  handleAdd(event){
    this.props.fetchAllSources("ordering=name")
    event.preventDefault() //prevent form submission
    this.setState({show:true})
  }
  onDismiss(){
    this.setState({visible:false})
  }
  handle_source_check(event){
    const target = event.target;
    const checked = target.checked  //true
    const value = JSON.parse(target.value);

    let object_new = Object.assign({},this.props.sources[0])
    if(checked === true){
        if (typeof(object_new.sources)==="undefined"){
            object_new.sources = [value]

        } else {
        object_new.sources.push(value)
        }
    } else {
      let filtered = object_new.sources.filter((source)=>{
          return value.id !== source.id
      })
      object_new.sources=filtered 
    }
    this.props.sourceFormUpdate(object_new)

    //this.setState(object:{...object_new}})
    //dispatch object to redux

  }
  render(){
      const sources = this.props.object.sources || []
      const selected_ids = sources.map(source=>source.id)
      const all_sources = this.props.allSources || []
      const all_loaded = this.props.allSrcLoaded || false
      const errors = this.props.errors || {}
      const err_name = errors.name ||'' 
      const err_sources = errors.sources || false
 
      sources.sort((a, b) => (a.name> b.name) ? 1 : -1)
      let object_name = this.props.object.name || ''
      return (
        <Form onSubmit={this.props.onSubmit} >
          {this.props.errors.sources?
              <Alert  > Sources: {this.props.errors.sources}</Alert> : ""}
          <FormGroup>
          <TextInput   
            onChange={this.props.handleChange}
            name={'name'}  
            label={'Name'}  
            value={object_name}  
            error={err_name} />
        </FormGroup>
          <FormGroup>
           {this.state.show ?
                    <div className="boxes">
                  { all_loaded === true ?
                      all_sources.map((source)=>{
                        return (
                          <CheckBoxInput   key={source.id} 
                            onChange={this.handle_source_check}
                            type={'checkbox'} 
                            name={source.name}  
                            label={source.name}
                            value={JSON.stringify(source)||""}
                            readOnly
                            checked={selected_ids.includes(source.id)}   />
                              )
                          }) : 
                      <span className="spinner-border" role="status">
                       <span className="sr-only">Loading...</span></span>
                  }
                </div>
                : <Button className="button-brand-primary" name={"Add"} onClick={this.handleAdd} size="lg">
                  Add Sources
                  </Button>
            }
        </FormGroup>
        <FormGroup>
          <Label for="list">Sources</Label>
          <ul id="list">
            {sources.map((source)=>{
              return (
                <li key={source.id}>
                  {source.name}
                </li>
              )
            })}
          </ul>
        </FormGroup>
          <FormGroup>
          <CheckBoxInput    
            onChange={this.props.handleChange}
            type={'checkbox'} 
            name={'active'}  
            readOnly
            label={'active'}  
            checked={this.props.object.active||false}   />
        </FormGroup>
          <FormGroup>
          <FormButtons saving={this.props.saving}
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
  object:propTypes.shape({
    id:propTypes.number,
    name:propTypes.string,
    active:propTypes.bool,
  }

  ),
  goBack:propTypes.func,
  onSubmit:propTypes.func
}
