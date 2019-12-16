import React, { Component } from 'react';
import {Form, Button, FormGroup, Label, Input} from 'reactstrap';

export default class extends Component {
  constructor(props){
    super(props)
  }
  componentDidMount(){
    // if  not ADD form
    if ( typeof this.props.match.params.id !== 'undefined'){
         this.props.fetchArticles('id='+this.props.match.params.id) 
       } 
 
  }
  render(){
    let articles = this.props.articlesList || [];
    let article = articles.length > 0 ? articles[0] : {}
    let clean_text = article.clean_text || ''
    let title = article.title || ''
    return (

      <div className="container mt-2 col-sm-8 offset-sm-2" >
        <Form>
         <FormGroup>
        <Label for="Article">{title}</Label>
        <Input type="textarea" className="bktextarea" name="text" rows="15" id="Article" readOnly value={clean_text}/>
      </FormGroup>
        <Button  onClick={this.props.history.goBack} className="button-brand-primary" size="lg">Back</Button>
      </Form>
      </div>

    )
  }
} 
