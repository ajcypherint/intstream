import React, {Component} from 'react'
import { Link } from 'react-router-dom';
import {Container} from 'reactstrap'
import FormButtons from "./compFormButtons"
import intstream from '../containers/IntStreamwhite.png'
import { Alert, Button, Jumbotron,  Form, FormGroup , Row, Col} from 'reactstrap';

import TextInput from './TextInput'

export default class LoginForm extends Component {
  constructor(props){
    super(props)
    this.state = {
      username: '',
      first_name: '',
      last_name: '',
      password: '',
      password2: '',
      email: '',
      org: '',
    }


    this.onSubmit = this.onSubmit.bind(this)
    this.goBack = this.goBack.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }
 
  handleInputChange(event){
    const target = event.target;
    const value = target.type ===
        'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
        [name]: value
      });
  }

  goBack(event){
    this.props.history.goBack()

  }
 
  onSubmit(event){
    event.preventDefault()
    this.props.register(
      this.state.org,
      this.state.username, 
      this.state.first_name,
      this.state.last_name,
      this.state.password,
      this.state.password2,
      this.state.email,
      this.props.history)
  }

  render() {
    const errors = this.props.errors || {}
    const saving = this.props.saving || false

    return (
     <div className="container" > <div className="row" > <div className="col-sm-4 " > </div>
         <div className="col-sm-4" align="center">
           <img src={intstream} className="img-fluid" width="300" hieght="200" alt="instream"/>
 
            <Container>
                  <Form onSubmit={this.onSubmit} align="center">
                  <FormGroup>
                  {errors.non_field_errors?<Alert color="danger">{errors.non_field_errors}</Alert>:""}
                  <TextInput name="username" label="Username" error={errors.username}  onChange={this.handleInputChange}/>
                  <TextInput name="first_name" label="First Name" error={errors.first_name}  onChange={this.handleInputChange}/>
                  <TextInput name="last_name" label="Last Name" error={errors.last_name}  onChange={this.handleInputChange}/>
                  <TextInput name="password" label="Password" error={errors.password} type="password" onChange={this.handleInputChange}/>
                  <TextInput name="password2" label="Password" error={errors.password} type="password" onChange={this.handleInputChange}/>
                  <TextInput name="email" label="Email" error={errors.email}  onChange={this.handleInputChange}/>
                  <TextInput name="org" label="Organization" error={errors.organization_name}  onChange={this.handleInputChange}/>
                </FormGroup>

                  <FormGroup>
        {saving===true?
               <span className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
               </span>:
                <Row>    
                  <Col>
                    <Button type="submit" className="button-brand-primary mb-1" size="lg">Register</Button>
                  </Col>
                  <Col>
                    <Button  onClick={this.props.history.goBack} className="button-brand-primary mb-1" size="lg">Back</Button>
                </Col>
                  </Row>
 
        }
                </FormGroup>
               </Form>


              </Container>
        </div>
       <div className="col-sm-4">
     </div>
 
     </div>
    </div>
 
    )
  }
}
