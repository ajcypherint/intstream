import React, { Component } from 'react';
import {Form, Row, Col, Button, FormGroup, Label, Input} from 'reactstrap';

export default class extends Component {
  constructor(props){
    super(props)
    this.next = this.next.bind(this)
  }
  componentDidMount(){
    // if  not ADD form
    if ( typeof this.props.match.params.id!== 'undefined'){
         this.props.fetchArticles() 
       } 
 
  }
  next(event){
    // todo(aj)
    this.props.history.push('/')
  }
  render(){
    let articles = this.props.articlesList || [];
    let article = articles.length > 0 ? articles[0] : ''
    let title = article.title
    let clean_text = article.clean_text
    let model = this.props.match.params.model
    return (

      <div className="container mt-2 col-sm-8 offset-sm-2" >

        <h1>{model}</h1>
        <Form>

         <FormGroup>
           <Label for="Article">{title}</Label>
        <Input type="textarea" name="text" rows="15" id="Article" readOnly value={clean_text}/>
      </FormGroup>
      
      <FormGroup>
        <Row>
        <Col>
          <Button  onClick={this.props.history.goBack} className="button-brand-primary" size="lg">Back</Button>
        </Col>
        <Col>
        <Button  onClick={this.next} className="button-brand-primary" size="lg">True</Button>
        </Col>
        <Col>
        <Button  onClick={this.next} className="button-brand-primary" size="lg">False</Button>
        </Col>
      </Row>
      </FormGroup>
    </Form>
      </div>

    )
  }
}
