import React from 'react'
import { Alert, Col, Row, Button, Form, FormGroup, FormFeedback, Label, Input } from 'reactstrap'
import TextInput from '../components/TextInput'
import { validateEmail } from '../containers/utils'
import intstream from '../containers/IntStreamwhite.png'

export default class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      submitDisabled: true
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount () {
    this.props.clear()
  }

  handleSubmit (event) {
    event.preventDefault()
    this.props.onSubmit(this.state.email, this.props.history)
  }

  handleChange (event) {
    this.setState({
      [event.target.name]: event.target.value
    })
    const valid = validateEmail(event.target.value)
    this.setState({ submitDisabled: !valid })
  }

  render () {
    const errors = this.props.errors || {}
    const message = this.props.message || ''
    return (
     <div className="container" >
       <div className="row" >
         <div className="col-sm-4 " >
         </div>
         <div className="col-sm-4" align="center">

           <img src={intstream} className="img-fluid" width="300" hieght="200" alt="instream"/>
          <Form onSubmit={this.handleSubmit}>
              {errors.non_field_errors ? <Alert color="danger">{errors.non_field_errors}</Alert> : ''}
              {message !== '' ? <Alert color="info">{message}</Alert> : ''}

            <FormGroup>
              <TextInput
                label="Email"
                error={errors.email}
                name="email"
                value = {this.state.email} onChange={this.handleChange}/>
            </FormGroup>
               <FormGroup >
                <div className="container">
                  <Row className="mt-1">
                    <Col className="text-center">
                      <Button type="submit" disabled={this.state.submitDisabled} className="brand-primary" size="lg">Submit</Button>
                    </Col>
                  </Row>
                  <Row className="mt-1">
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
