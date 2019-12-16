import React from 'react'
import _ from 'lodash';
import { Input, Table,  Alert, Form, Row, Col, FormGroup, Button, ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
import '../custom.css';
import Paginate from './Paginate'
import {PAGINATION, dateString, addDays} from '../util/util'
import {changesort} from './ChangeSort'
import {ASC, DESC, ALL} from "../util/util"
import {Children} from "./Children"

export class Main extends React.Component{
  constructor(props){
    super(props)
    this.dateString = dateString.bind(this)
    this.handleSourceChange = this.handleSourceChange.bind(this) 
    this.handleStartChange = this.handleStartChange.bind(this)
    this.handleEndChange = this.handleEndChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.changesort = changesort.bind(this)
    this.updateDate = this.updateDate.bind(this)
  }
  componentDidMount() {
    let selections = this.props.parent.homeSelections
    //todo() ordering
    this.props.fetchAllSources(
    "start_upload_date="+selections.startDate.toISOString()+
    "&end_upload_date="+selections.endDate.toISOString()+
    "&source__active=true"
    )
    this.props.parent_func.fetchArticles(this.dateString(
        selections.orderdir,
        selections.ordercol,
        selections.sourceChosen,
        selections.page,
        selections.startDate,
        selections.endDate
        )) 
  }
  
  handleStartChange(date){
    let selections = this.props.parent.homeSelections
    this.updateDate(date,selections.endDate, true)
  }
  handleEndChange(date){
    let selections = this.props.parent.homeSelections
    this.updateDate(selections.startDate,date,false)
  }

  updateDate(startDate,endDate,start_filter=true){
    // unset sourceChosen
    // fix start_date or end_date based on input
    //startdate - date
    //enddate - date
    //start_end - bool
    if (start_filter === true){
      if(startDate > endDate){
        endDate = new Date(startDate.getTime())
        
      }
    } else {
      if(endDate < startDate){
        startDate = new Date(endDate.getTime())
        //fix start date
        //fix end date

      }
    }
    startDate.setHours(0,0,0,0);
    endDate.setHours(23,59,59,999);
        
    // fetch all cascading filters
    // todoaj(foreach cascading insert here
    // refactor filter components in to one large component
    this.props.fetchAllSources(
    "start_upload_date="+startDate.toISOString()+
    "&end_upload_date="+endDate.toISOString()+
    "&source__active=true"
    )
    // update cascading filters
    this.props.parent_func.setHomeSelections({
      page:1,
      startDate:startDate,
      endDate:endDate,
      })
    //fetch articles 
    this.props.parent_func.fetchArticles(this.dateString(
      this.props.parent.homeSelections.orderdir,// orderdir
      this.props.parent.homeSelections.ordercol, // ordercol 
      this.props.parent.homeSelections.sourceChosen,// sourceChosen
      1,  // page
      startDate,
      endDate
    )) 

 }
  handleSourceChange(event){
    //last filter.  do not need to unset others
    event.preventDefault()
    let selections = this.props.parent.homeSelections
    this.props.parent_func.setHomeSelections({
      sourceChosen:event.target.value,
      page:1
      })
    this.props.parent_func.fetchArticles(dateString(selections.orderdir,
        selections.ordercol,
        event.target.value,
        1,
        selections.startDate,
        selections.endDate)) 

  }
  onSubmit(event){
    event.preventDefault()
  } 
  fetch(selections,page){
    this.props.parent_func.fetchArticles(dateString(
            selections.orderdir,
            selections.ordercol,
            selections.sourceChosen,
            page,
            selections.startDate,
            selections.endDate
          ))
  }
  render(){
    let selections = this.props.parent.homeSelections
    const articles = this.props.parent.articlesList || [];
    const loading = typeof this.props.parent.articlesLoading === 'undefined' ? true : this.props.parent.articlesLoading;
    const totalcount= this.props.parent.articlesTotalCount ||0;
    const next = this.props.parent.articleNext ;
    const previous = this.props.parent.articlePrevious;
    const errors = this.props.parent.articlesErrors || {}
    const ids = this.props.sourcesList.map(a=>a.id.toString()) ||[]
    return(
      <div className="container mt-2 col-sm-8 offset-sm-2" >
        <Form onSubmit={this.onSubmit} >
          {errors.detail?<Alert color="danger">{errors.detail}</Alert>:""}
       <Row>
        <Col sm="4">
          <label  htmlFor={"start_id"}>{"Start Date"}</label>
          <div className = "mb-2 ">
          <DatePicker style={{width:'100%'}} id={"startDate"}  selected={selections.startDate} onChange={this.handleStartChange} />
          </div>
        </Col>
        <Col sm="4" >
          <label  htmlFor={"end_id"}>{"End Date"}</label>
          <div className = "mb-2 ">
          <DatePicker  id={"endDate"}  selected={selections.endDate} onChange={this.handleEndChange}/>
          </div>
        </Col>

         <Col sm="4">
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
    <Table>
    <Children parent_func={this.props.parent_func}
      level={0}
      child={this.props.child}
      parent={this.props.parent}/>
  </Table>
  </Form>
   </div>
    )
 
 }
};

Main.propTypes = {
  articleList:propTypes.array,
  sourcesList:propTypes.array,
};
