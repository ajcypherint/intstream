import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Container, Alert, Button, Jumbotron, Form, FormGroup, Row } from 'reactstrap'

import TextInput from './TextInput'

export default class LoginForm extends Component {
  constructor (props) {
    super(props)

    this.state = {
      password: ''
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  handleInputChange (event) {
    const target = event.target
    const value = target.type ===
        'checkbox'
      ? target.checked
      : target.value
    const name = target.name
    if (name === 'username') {
      this.props.onUserChange(event.target.value)
    }
    if (name === 'password') {
      this.setState({
        [name]: value
      })
    }
  }

  onSubmit (event) {
    event.preventDefault()
    this.props.onSubmit(this.props.username, this.state.password)
  }

  render () {
    const errors = this.props.errors || {}
    const message = this.props.message || ''

    return (
      <Container>
            <Form onSubmit={this.onSubmit} align="center">
            <FormGroup>
            {errors.detail ? <Alert color="danger">{errors.detail}</Alert> : ''}
            {message !== '' ? <Alert color="info">{message}</Alert> : ''}
            <TextInput name="username" label="Username" error={errors.username} onChange={this.handleInputChange}/>
            <TextInput name="password" label="Password" error={errors.password} type="password" onChange={this.handleInputChange}/>
          </FormGroup>
          <FormGroup>
            <Button type="submit" className="button-brand-primary" size="lg">Log In</Button>
          </FormGroup>
          <FormGroup>
            <Link to={'/forgot_password'}>
               Forgot Password
             </Link>
          </FormGroup>
          <FormGroup>
           <Link to={'/register'}>
               Register
             </Link>
          </FormGroup>
          </Form>
        </Container>

    )
  }
}
