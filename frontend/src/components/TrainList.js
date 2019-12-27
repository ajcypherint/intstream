import React, { Component } from 'react';
import {Alert, Form, Row, Col, Button, FormGroup, Label, Input} from 'reactstrap';
import DatePicker from 'react-datepicker'
import {PAGINATION,dateString, addDays} from '../util/util'

export default class extends Component {
  constructor(props){
    super(props)
  }
  handleSourceChange(event){
    //last filter.  do not need to unset others
    let selections = this.props.trainSelections
    this.props.parent_func.settrainSelections({
      sourceChosen:event.target.value,
      page:1
      })
    this.props.fetchArticles(dateString(selections.orderdir,
      selections.ordercol,
      event.target.value,
      1,
      selections.startDate,
      selections.endDate,
      )) 

   this.props.child_func.clearParent()
  }
 
  componentDidMount(){

  }
  render(){
    let articles = this.props.articlesList || [];
    const errors = this.props.articlesErrors || {}
    let selections = this.props.trainSelections
    const ids = this.props.sourcesList.map(a=>a.id.toString()) ||[]
    return (

      <div className="container mt-2 col-sm-8 offset-sm-2" >

        {errors.error?<Alert color="danger">{errors.error}</Alert>:""}
        <Form>
       <FormGroup>
         <Row>
        <Col sm="3" >
          <label  htmlFor={"model_id"}>{"Model"}</label>
           <Input type="select" name="Model" value={null} id="source_id" onChange={this.handleModelChange}>
           </Input>

        </Col>
        </Row>
         <Row>
        <Col sm="3" md="3" lg="2">
          <label  htmlFor={"start_id"}>{"Start Date"}</label>
          <div className = "mb-2 ">
          <DatePicker style={{width:'100%'}} id={"startDate"}  selected={selections.startDate} onChange={this.handleStartChange} />
          </div>
        </Col>
        <Col sm="3" md="3" lg="2">
          <label  htmlFor={"end_id"}>{"End Date"}</label>
          <div className = "mb-2 ">
          <DatePicker  id={"endDate"}  selected={selections.endDate} onChange={this.handleEndChange}/>
          </div>
        </Col>

         <Col sm="3" md="3" lg="5">
           <label  htmlFor={"source_id"}>{"Source"}</label> 
          <div >
           <Input type="select" name="Source" value={selections.sourceChosen} id="source_id" onChange={this.handleSourceChange}>
             <option value={""}>---</option>
             {ids.includes(selections.sourceChosen)===false && selections.sourceChosen!==''? 
               <option value={selections.sourceChosen}>{selections.sourceChosen}</option>:''}
             {this.props.sourcesList.map((source)=>{
               return ( <option key={source.id} 
                                value={source.id}>
                                {source.name}</option>)
             })
             }
              </Input> 

          </div>
        </Col>
      </Row>
    </FormGroup>
    </Form>
      </div>

    )
  }
}
