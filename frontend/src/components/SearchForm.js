import React, {Component} from 'react'
import {Container} from 'reactstrap'
import { Alert, Button, Jumbotron,  Form } from 'reactstrap';
import FilterBar from '../components/FilterBar.js'
import PropTypes from 'prop-types';

export default class SearchForm extends Component {
  constructor(props){
    super(props)
    this.state={
      na:'',
    }
 
    //this.handleClick = this.handleClick.bind(this)
    //this.handleChange = this.handleChange.bind(this)
  }
 
  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type ===
        'checkbox' ? target.checked : target.value;
    const name = target.name;
    
  }


  onSubmit = (event) => {
    event.preventDefault()
  }

  render() {
    const errors = this.props.errors || {}

    return (
      <div className="container mt-2 col-sm-8 offset-sm-2" >
            <Form onSubmit={this.onSubmit} >
            {errors.non_field_errors?<Alert color="danger">{errors.non_field_errors}</Alert>:""}
            <FilterBar pageName={this.props.pageName} 
              catLabel={this.props.catLabel}
              startLabel={this.props.startLabel} 
              endLabel={this.props.endLabel}/> 

          </Form>
        </div>
    )
  }
}

SearchForm.propTypes = {
  pageName:PropTypes.string,
  startLabel:PropTypes.string,
  endLabel:PropTypes.string,
  catLabel:PropTypes.string

}
