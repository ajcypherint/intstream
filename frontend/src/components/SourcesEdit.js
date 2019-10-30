import React, { Component } from 'react';
import {Container} from 'reactstrap'
import { Alert, Button, Jumbotron,  Form } from 'reactstrap';
import propTypes from 'prop-types'
import Edit from './SourceEditFormComp'
import {SourceLoading} from './sourceLoading'
import {ADDFORM, EDITFORM} from './Main'
import {withRouter} from 'react-router-dom'
import {ADD,EDIT} from './Main'

class SourcesEdit extends Component {
  constructor(props){
    super(props)
    this.state=this.props.state
   this.handleInputChange = this.handleInputChange.bind(this) 
   this.onSubmit = this.onSubmit.bind(this)
    this.goBack = this.goBack.bind(this)
  }
  componentDidMount(){
   if ( typeof this.props.match.params.id !== 'undefined'){
     this.props.fetchSources('id='+this.props.match.params.id) 
   } else {
     this.props.clearSources()
   }
  }
  componentWillReceiveProps(nextProps){
    if (nextProps.sources.length > 0 && this.state.action !== "ADD"){
      this.setState(
        {
          object:nextProps.sources[0],
        }
      )
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
    if (this.state.action === EDITFORM) {
      this.props.setSources(this.state.object.id+'/',this.state.object) 
      // this.props.fetchSources('id='+this.state.object.id) 
    } else {

      this.props.setSources('',this.state.object,'POST') 
      //redirect to listing
    }
  }
  render(){

    const loading = this.props.loading;
    const error = this.props.errors || {};
    
    const prefix = this.props.state.action === EDITFORM ? "Edit " : "Add ";
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
             object:this.state.object,
             onSubmit:this.onSubmit,
             handleChange : this.handleInputChange,
             errors:error,
             saving:this.props.saving,
             goBack:this.goBack

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
