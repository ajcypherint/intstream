import React from 'react'
import _ from 'lodash';
import { Input, Table,  Alert, Form, Row, Col, FormGroup, Button, ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
import '../custom.css';
import Paginate from './Paginate'
import {PAGINATION,childString, dateString, addDays} from '../util/util'
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
    this.handleThresholdChange = this.handleThresholdChange.bind(this)
    this.handleMaxDfChange = this.handleMaxDfChange.bind(this)
    this.handleMinDfChange = this.handleMinDfChange.bind(this)
  }
  handleMaxDfChange(event){
    this.props.parent_func.setHomeSelections({
      maxDf:event.target.value,
    })
    this.props.parent_func.fetchArticles(this.dateString(
      this.props.parent.homeSelections.orderdir,// orderdir
      this.props.parent.homeSelections.ordercol, // ordercol 
      this.props.parent.homeSelections.sourceChosen,// sourceChosen
      1,  // page //probably fewer pages
      this.props.parent.homeSelections.startDate,
      this.props.parent.homeSelections.endDate,
      this.props.parent.homeSelections.threshold,
    )+"&max_df="+event.target.value+"&min_df="+this.props.parent.homeSelections.minDf) 
  }
  handleMinDfChange(event){
    this.props.parent_func.setHomeSelections({
      minDf:event.target.value,
    })
    this.props.parent_func.fetchArticles(this.dateString(
      this.props.parent.homeSelections.orderdir,// orderdir
      this.props.parent.homeSelections.ordercol, // ordercol 
      this.props.parent.homeSelections.sourceChosen,// sourceChosen
      1,  // page //probably fewer pages
      this.props.parent.homeSelections.startDate,
      this.props.parent.homeSelections.endDate,
      this.props.parent.homeSelections.threshold,
    )+"&max_df="+this.props.parent.homeSelections.maxDf+"&min_df="+event.target.value) 
  }
  handleThresholdChange(event){
    this.props.parent_func.setHomeSelections({
      page:1,
      threshold:event.target.value
    })
    this.props.parent_func.fetchArticles(this.dateString(
      this.props.parent.homeSelections.orderdir,// orderdir
      this.props.parent.homeSelections.ordercol, // ordercol 
      this.props.parent.homeSelections.sourceChosen,// sourceChosen
      1,  // page //probably fewer pages
      this.props.parent.homeSelections.startDate,
      this.props.parent.homeSelections.endDate,
      event.target.value
    )+"&max_df="+this.props.parent.homeSelections.maxDf
      +"&min_df="+this.props.parent.homeSelections.minDf) 

    this.props.child_func.clearParent()
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
      selections.endDate,
      selections.threshold)
      +"&max_df="+selections.maxDf
      +"&min_df="+selections.minDf) 

  }
 
  handleStartChange(date){
    let selections = this.props.parent.homeSelections
    this.updateDate(date,selections.endDate, true)
    this.props.child_func.clearParent()
  }
  handleEndChange(date){
    let selections = this.props.parent.homeSelections
    this.updateDate(selections.startDate,date,false)
    this.props.child_func.clearParent()
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
      endDate,
      this.props.parent.homeSelections.threshold
    )+"&max_df="+this.props.parent.homeSelections.maxDf+
      "&min_df="+this.props.parent.homeSelections.minDf) 

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
      selections.endDate,
      selections.threshold) 
      +"&max_df="+selections.maxDf
      +"&min_df="+selections.minDf) 


   this.props.child_func.clearParent()
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
      selections.endDate,
      selections.threshold)
      +"&max_df="+selections.maxDf
      +"&min_df="+selections.minDf) 

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
    const threshold_values = []
    for(let i=100;i>=0;i-=5){
      threshold_values.push(i)
    }
    return(
      <div className="container mt-2 col-sm-12" >
        <Form onSubmit={this.onSubmit} >
          {errors.detail?<Alert color="danger">{errors.detail}</Alert>:""}
       <FormGroup>
       <Row>
        <Col sm="2" md="2" lg="2">
          <label  htmlFor={"start_id"}>{"Start Date"}</label>
          <div className = "mb-2 ">
          <DatePicker style={{width:'100%'}} id={"startDate"}  selected={selections.startDate} onChange={this.handleStartChange} />
          </div>
        </Col>
        <Col sm="2" md="2" lg="2">
          <label  htmlFor={"end_id"}>{"End Date"}</label>
          <div className = "mb-2 ">
          <DatePicker  id={"endDate"}  selected={selections.endDate} onChange={this.handleEndChange}/>
          </div>
        </Col>

         <Col sm="2" md="2" lg="5">
           <label  htmlFor={"source_id"}>{"Source"}</label> 
          <div >
           <Input type="select" name="Source" value={selections.sourceChosen} id="source_id" onChange={this.handleSourceChange}>
             <option  value={""}>---</option>
             {ids.includes(selections.sourceChosen)===false && selections.sourceChosen!==''? 
               <option  value={selections.sourceChosen}>{selections.sourceChosen}</option>:''}
             {this.props.sourcesList.map((source)=>{
               return ( <option  key={source.id} 
                                value={source.id}>
                                {source.name}</option>)
             })
             }
              </Input> 

          </div>
        </Col>
        <Col sm="2" md="2" lg="1">
           <label  htmlFor={"threshold"}>{"Max Cluster Dif"}</label> 
           <Input type="select" name="threshold" value={selections.threshold} id="threshold_id" onChange={this.handleThresholdChange}>
             {threshold_values.map((value)=>{
               return (<option key={value} value={value}>{value}</option>
               )
             }
             )}
           </Input>
        </Col>
        <Col sm="2" md="2" lg="1">
           <label  htmlFor={"min_df"}>{"Min Doc Freq"}</label> 
           <Input type="select" name="min_df" disabled={selections.threshold==="0"}
             value={selections.minDf} id="min_df" onChange={this.handleMinDfChange}>
             {threshold_values.map((value)=>{
               return (<option key={value} value={value}>{value}</option>
               )
             }
             )}
           </Input>
        </Col>
        <Col sm="2" md="2" lg="1">
           <label  htmlFor={"max_df"}>{"Max Doc Freq"}</label> 
           <Input type="select" name="max_df" disabled={selections.threshold==="0"}
             value={selections.maxDf} id="max_df" onChange={this.handleMaxDfChange}>
             {threshold_values.map((value)=>{
               return (<option key={value} value={value}>{value}</option>
               )
             }
             )}
           </Input>
        </Col>



    </Row>
  </FormGroup>
      </Form>
      <Children 
          parent_func={this.props.parent_func}
          level={0}
          child={this.props.child}
          child_func={this.props.child_func}
          parent_id = {-1}
          parent_trail={this.props.child.parentTrail}
          show_children={this.showChildren}

          selectArticles={this.props.selectArticles}
          selectErrors={this.props.selectErrors}
          fetchSelect={this.props.fetchSelect}
          clearSelect={this.props.clearSelect}

          parent={this.props.parent}/>

   </div>
    )
 
 }
};

Main.propTypes = {
  articleList:propTypes.array,
  sourcesList:propTypes.array,
};
