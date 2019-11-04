import React, { Component } from 'react';
import {Button, FormGroup, Label, Input} from 'reactstrap';

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
    let article = articles.length > 0 ? articles[0] : ''
    return (

      <div className="container mt-2 col-sm-8 offset-sm-2" >
         <FormGroup>
        <Label for="Article">Article</Label>
        <Input type="textarea" name="text" rows="20" id="Article" value={article.text}/>
      </FormGroup>
        <Button  onClick={this.props.history.goBack} className="button-brand-primary" size="lg">Back</Button>
      </div>

    )
  }
} 
