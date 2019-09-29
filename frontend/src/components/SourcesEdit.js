import React, { Component } from 'react';
import _ from 'lodash';
import {Container} from 'reactstrap'
import { Alert, Button, Jumbotron,  Form } from 'reactstrap';
import TextInput from './TextInput'
import CheckBoxInput from './CheckBoxInput'
import propTypes from 'prop-types'
import {Edit} from './sourceEditForm'
import {SourceLoading} from './sourceLoading'
export default class SourcesEdit extends Component {
  constructor(props){
    super(props)
    this.state=this.props.state
   this.handleInputChange = this.handleInputChange.bind(this) 
   this.onSubmit = this.onSubmit.bind(this)
  }
  componentWillMount() {
    this.props.fetchSources('id='+this.props.match.params.id);
 }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type ===
        'checkbox' ? target.checked : target.value;
    const name = target.name;
    let object = Object.assign({},this.state.object)
    object[name]=value
    this.setState({object:{...object}})
  }


  onSubmit(event){
    event.preventDefault()
    //let data = {
    // id:this.state.id,
    // name:this.state.name,
    // active:this.state.active
    //}
    this.props.setSources('/'+this.state.object.id+'/',this.state.object)
  }
  render(){

    const loading = this.props.loading;
    const error = this.props.errors || {};
    const heading = this.props.heading;
    if(this.state.firstrender) { 
      this.setState({firstrender:false})
       return ( <SourceLoading heading={heading}/>)
   } 
 
    if(loading) { 
       return ( <SourceLoading heading={heading}/>)
    } 
    if( this.state.stateLoaded===false){
      this.setState(
        {
          object:this.props.sources[0],
          stateLoaded:true
        }
      )
    }

    const name = this.state.object.name 
    const active = this.state.object.active 
    return (
       <div className="row" >
        <div className="col-sm-4"/>
        <div className="col-sm-4">
       <Container>

         <h1>{this.props.heading}</h1>
         <Edit name={name} 
           onSubmit={this.onSubmit}
           active={active} 
           handleChange = {this.handleInputChange}
           errors={error}/>
        </Container>
      </div>
        <div className="col-sm-4"/>
      </div>
  )
  } 
 
};

SourcesEdit.propTypes = {
  heading:propTypes.string,
  errors:propTypes.object,
  source:propTypes.object.isRequired,
  loading:propTypes.object.isRequired,
  match:propTypes.object,
  fields:propTypes.arrayOf(
    propTypes.string
    ).isRequired,
  fetchSources:propTypes.func
};
