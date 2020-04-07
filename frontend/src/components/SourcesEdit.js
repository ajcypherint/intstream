import React, { Component } from 'react';
import {Container} from 'reactstrap'
import _ from 'lodash';
import { Alert, Button, Jumbotron,  Form } from 'reactstrap';
import propTypes from 'prop-types'
import Edit from './SourceEditFormComp'
import {SourceLoading} from './sourceLoading'
import {withRouter} from 'react-router-dom'
import {ADD,EDIT} from '../util/util'
class SourcesEdit extends Component {
  constructor(props){
    super(props)
    this.state=this.props.state
   this.handleInputChange = this.handleInputChange.bind(this) 
   this.onSubmit = this.onSubmit.bind(this)
    this.goBack = this.goBack.bind(this)
  }
  componentDidMount(){
    // if  EDIT form
       if ( typeof this.props.match.params.id !== 'undefined'){
         this.props.fetchSources('id='+this.props.match.params.id) 
       } else {
         // ADD
         this.props.clearSources()
         this.props.sourceFormUpdate(this.props.empty)
       }
  }
  goBack(event){
    event.preventDefault() //prevent form submission
    this.props.history.goBack()

  }
  handleInputChange(event) {
    const target = event.target;
    const value = target.type ===
        'checkbox' ? target.checked : target.value;
    const name = target.name;
    let object_new = Object.assign({},this.props.sources[0])
    object_new[name]=value

    //this.setState(object:{...object_new}})
    //dispatch object to redux
    this.props.sourceFormUpdate(object_new)
  }


  onSubmit(event){
    event.preventDefault()
    if (this.state.action === EDIT) {
      this.props.setSources(this.props.sources[0].id+'/',this.props.sources[0]) 
    } else {
      this.props.addSources('',
        this.props.sources[0],
        "POST",
        this.props.history.goBack)
    }
  }
  render(){

    const loading = this.props.loading;
    const error = this.props.errors || {};
    const source = this.props.sources[0] || {};
    
    const prefix = this.state.action === EDIT ? EDIT : ADD;
    const heading = prefix + this.props.heading;

    return (
       <div className="row" >
        <div className="col-sm-4"/>
        <div className="col-sm-4">
       <Container>

         <h1>{heading}</h1>
         {error.detail?<Alert color="danger">{error.detail}</Alert>:""}
         {React.cloneElement(this.props.form,
           {
             object:source,
             onSubmit:this.onSubmit,
             handleChange : this.handleInputChange,
             errors:error,
             saving:this.props.saving,
             goBack:this.goBack,
             ...this.props

           }
         )
        }
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
  source:propTypes.object,
  loading:propTypes.bool,
  match:propTypes.object,
  fetchSources:propTypes.func,
  clearSources:propTypes.func
};

export default withRouter(SourcesEdit)
