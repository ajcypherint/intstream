import React, {Component} from 'react'
import { Link } from 'react-router-dom';
import {Container} from 'reactstrap'
import { Alert, Button, Jumbotron,  Form, FormGroup , Row} from 'reactstrap';

import TextInput from './TextInput'

export default class LoginForm extends Component {
  state = {
    username: '',
    password:'',
    password2:'',
    email:'',
    org:'',
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type ===
        'checkbox' ? target.checked : target.value;
    const name = target.name;
    if(name==="username"){
      this.props.onUserChange(event.target.value)
    }
    this.setState({
        [name]: value
      });
  }


  onSubmit = (event) => {
    event.preventDefault()
    this.props.onSubmit(this.props.username, 
      this.state.email,
      this.state.Organization,
      this.state.password)
  }

  render() {
    const errors = this.props.errors || {}

    return (
      <Container>
            <Form onSubmit={this.onSubmit} align="center">
            <FormGroup>
            {errors.detail?<Alert color="danger">{errors.detail}</Alert>:""}
            <TextInput name="username" label="Username" error={errors.username}  onChange={this.handleInputChange}/>
            <TextInput name="password" label="Password" error={errors.password} type="password" onChange={this.handleInputChange}/>
            <TextInput name="password2" label="Password" error={errors.password} type="password" onChange={this.handleInputChange}/>
            <TextInput name="email" label="Email" error={errors.email}  onChange={this.handleInputChange}/>
            <TextInput name="org" label="Organization" error={errors.organization}  onChange={this.handleInputChange}/>
          </FormGroup>
          <FormGroup>
            <Button type="submit" className="button-brand-primary" size="lg">Register</Button>
          </FormGroup>
          <FormGroup>
            <Link to={"/forgot_password"}>
               Forgot Password
             </Link>
          </FormGroup>
          </Form>
        </Container>
 
    )
  }
:
