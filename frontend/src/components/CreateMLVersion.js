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
    this.state={metric:"f1",extra:'{}'}
    this.handleMetricChange=this.handleMetricChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleExtra = this.handleExtra.bind(this)
  }
  componentDidMount(){
    //fetch model info
    this.props.fetchModel("id="+this.props.match.params.id)
  }
  handleMetricChange(event){
    this.setState({metric:event.target.value})

  }
  handleExtra(event){
    this.setState({extra:event.target.value})
  }
  handleSubmit(model, event){
    event.preventDefault()
    this.props.trainRedirect(this.props.match.params.id, 
      this.props.history, 
      '/mlversionlist/', 
      this.state.metric, 
      this.state.extra)
  }

  render(){
    const errors = this.props.trainCreateErrors || {}
    let model_id = this.props.match.params.id
    let models= this.props.modelList || []
    let model_name = models.length > 0 ? models[0].name : ""
    //todo(aj) add heading with model name; element 0 
    return (
      <div className="container mt-2 col-sm-4 offset-sm-4" >
        <h1>Model: {model_name}</h1> 
        <Form onSubmit={this.handleSubmit.bind(this,model_id)} >
          {errors.detail?<Alert color="danger">{errors.detail}</Alert>:""}
           <FormGroup>
           <Row>
            <Col>
              <label  htmlFor={"metric"}>{"Metric"}</label>
               <Input type="select" name="Source" value={this.state.metric} id="source_id" onChange={this.handleMetricChange}>
                 <option value="f1">f1</option>
                 <option value="weightedPrecision">Precision</option>
                 <option value="weightedRecall">Recall</option>
                 <option value="accuracy">Accuracy</option>
               </Input>
            </Col>
          </Row>
           <Row>
            <Col>
              <label  htmlFor={"extra"}>{"Extra Kwargs"}</label>
              <Input type="text" name="extra" value={this.state.extra} id="extra_id" onChange={this.handleExtra}/>
            </Col>
          </Row>
 
          </FormGroup>
          <FormGroup>
            <Row>
            <Col>
               <Button type="submit" 
                  className="button-brand-primary" size="lg">Submit</Button>
            </Col>
          </Row>
        </FormGroup>
        </Form>
      </div>
       
      )

  }
}
 
