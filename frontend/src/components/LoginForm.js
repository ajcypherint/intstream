import React, {Component} from 'react'
import { Link } from 'react-router-dom';
import {Container} from 'reactstrap'
import { Alert, Button, Jumbotron,  Form, FormGroup , Row} from 'reactstrap';

import TextInput from './TextInput'

export default class LoginForm extends Component {
  state = {
    password: ''
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type ===
        'checkbox' ? target.checked : target.value;
    const name = target.name;
    if(name==="username"){
      this.props.onUserChange(event.target.value)
    }
    if (name==="password"){
      this.setState({
        [name]: value
      });
    }
  }


  onSubmit = (event) => {
    event.preventDefault()
    this.props.onSubmit(this.props.username, this.state.password)
  }

  render() {
    const errors = this.props.errors || {}

    return (
      <Container>
            <Form onSubmit={this.onSubmit} Align="center">
            <FormGroup>
            {errors.detail?<Alert color="danger">{errors.detail}</Alert>:""}
            <TextInput name="username" label="Username" error={errors.username}  onChange={this.handleInputChange}/>
            <TextInput name="password" label="Password" error={errors.password} type="password" onChange={this.handleInputChange}/>
          </FormGroup>
          <FormGroup>
            <Button type="submit" className="button-brand-primary" size="lg">Log In</Button>
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
}
