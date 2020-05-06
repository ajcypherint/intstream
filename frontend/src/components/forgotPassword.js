import React from 'react'
import { Alert,Col,Row,Button,Form,FormGroup, FormFeedback, Label, Input } from 'reactstrap';
import TextInput from '../components/TextInput'
import {validateEmail} from "../containers/utils"
import intstream from '../containers/IntStreamwhite.png'

export default class Main extends React.Component{
 
  constructor(props){
    super(props)
    this.state = {
      email: '',
      submitDisabled:true
    }
   
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleSubmit(event){
    event.preventDefault()
    this.props.sendEmail(event.target.value, this.props.history)
  }
  handleChange(event){
    this.setState({
      [event.target.name]:event.target.value
    })
    let valid = validateEmail(event.target.value)
    this.setState({submitDisabled:!valid})
  }

  render(){
    const errors = this.props.errors || {}
    return (
     <div className="container" >
       <div className="row" >
         <div className="col-sm-4 " >
         </div>
         <div className="col-sm-4" align="center">
 
           <img src={intstream} class="img-fluid" width="300" hieght="200" alt="instream"/>
          <Form onSubmit={this.handleClick}>
              {errors.non_field_errors?<Alert color="danger">{errors.non_field_errors}</Alert>:""}
              
              <TextInput className="form-control"  
                type="text"
                label="Email"
                error={errors.email}
                name="email"  
                value = {this.state.email} onChange={this.handleChange}/>
  
              <FormGroup >
                <div className="container">
                  <Row>
                    <Col className="text-center"> 
                      <Button type="submit" disabled={this.state.submitDisabled} className="brand-primary" size="lg">Submit</Button>
                    </Col>
                    <Col className="text-center"> 
                      <Button className="brand-primary" size="lg" onClick={this.props.history.goBack}>Back</Button>
                    </Col>
                  </Row>
              </div>
            </FormGroup>
        </Form>
       </div>
       <div className="col-sm-4">
       </div>
     </div>
   </div>
 
      )

  }
 
}
