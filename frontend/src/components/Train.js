import React, { Component } from 'react';
import {Alert, Form, Row, Col, Button, FormGroup, Label, Input} from 'reactstrap';

export default class extends Component {
  constructor(props){
    super(props)
    this.next = this.next.bind(this)
  }
  componentDidMount(){
    // if  not ADD form
    if ( typeof this.props.match.params.id!== 'undefined'){
         this.props.fetchArticles(this.props.match.params.id) 
       } 
 
  }
  next(event){
    // todo(aj)
    let model_id = event.target.value.model
    let value = event.target.value.class
    this.props.fetchArticles(model_id) 
  }
  render(){
    let articles = this.props.articlesList || [];
    let article = articles.length > 0 ? articles[0] : {}
    let title = article.title || ''
    let clean_text = article.clean_text || ''
    let model = this.props.match.params.model
    let model_id = this.props.match.params.id
    const errors = this.props.articlesErrors || {}
    return (

      <div className="container mt-2 col-sm-8 offset-sm-2" >

        <h1>{model}</h1>
        {errors.error?<Alert color="danger">{errors.error}</Alert>:""}
        <Form>

         <FormGroup>
           <Label for="Article">{title}</Label>
        <Input type="textarea" className="bktextarea" name="text" rows="15" id="Article" readOnly value={clean_text}/>
      </FormGroup>
      
      <FormGroup>
        <Row>
       <Col>
          <Button  onClick={this.true} value={{model:model_id,class:true}} className="button-brand-primary" size="lg">True</Button>
        </Col>
        <Col>
          <Button  onClick={this.next} value={{model:model_id,class:false}} className="button-brand-primary" size="lg">False</Button>
        </Col>
        <Col>
          <Button  onClick={this.props.history.goBack} className="button-brand-primary" size="lg">Edit {model}</Button>
        </Col>
      </Row>
      </FormGroup>
    </Form>
      </div>

    )
  }
}
