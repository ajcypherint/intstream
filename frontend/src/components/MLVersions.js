// form 
// show model from train page, 
// choose metric; f1, recall, precision; hard code options for Logistic Regression for now
// button - train
//
// call task: train.
//
// redirect to modelversion list page
// filter by model.   websocket channel for updates to list as train will create new model. or polling with react.
// list page: model, version, task_id, classify_history button, active
import React from 'react'
import _ from 'lodash';
import { Input, Table,  Alert, Form, Row, Col, FormGroup, Button, ListGroup, ListGroupItem } from 'reactstrap';

export default class Main extends React.Component{
  constructor(props){
    super(props)
    this.handleMetricChange=this.handleMetricChange.bind(this)
  }
  componentDidMount(){
    //fetch model info
    //this.props.fetchMLModels("id="+this.props.match.params.id)
  }
  render(){
    const errors = this.props.trainCreateErrors || {}
    //todo(aj) add heading with model name; element 0 
    return (
      <div className="container mt-2 col-sm-4 offset-sm-4" >
        <h1>Versions Page Holder</h1> 
     </div>
       
      )

  }
}
 
