import React from 'react'
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'
import * as reducers from '../reducers/'
import TextInput from './TextInput'
import SubmitButton from './Submit.js'

import { Col,Alert,Form,FormGroup,Button,ListGroup,ListGroupItem } from 'reactstrap';
class Main extends React.Component{
  constructor(props){
    super(props)
    this.state={
      na:'',
    }
 
    this.handleClick = this.handleClick.bind(this)
    this.handleChange = this.handleChange.bind(this)


  }
  handleChange(event){
    this.setState({
      na:event.target.value
    })
  }
  handleClick(event){
    //call action to unshorten url
    event.preventDefault()
    //this.props.submitLoading ? this.props.onCancel() : this.props.onSubmit(this.state.url)
  }


  render(){
    
    const errors = this.props.errors || {}
    return(
     <div className="col-sm-8 offset-sm-2" >
        <Form onSubmit={this.handleClick}>
            {errors.non_field_errors?<Alert color="danger">{errors.non_field_errors}</Alert>:""}

            <TextInput   
              label="InputSomething"
              error={errors.url}
              name="urlinput"  
              value = {this.state.na} onChange={this.handleChange}/>
            <SubmitButton />          
     </Form>
      <ListGroup>
              <ListGroupItem>
                test
              </ListGroupItem>
              <ListGroupItem>
                test2
             </ListGroupItem>

      </ListGroup>
     </div>
  
    )
 
 }
}

const mapStateToProps = (state) => ({
})


const mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(Main);
