import React from 'react'
import _ from 'lodash';
import { Input, Table,  Alert, Form, Row, Col, FormGroup, Button, ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
import Paginate from './Paginate'
import {PAGINATION, dateString, addDays} from '../util/util'
import {changesort} from './ChangeSort'
import {ASC, DESC, ALL} from "../util/util"

export class Main extends React.Component{
  constructor(props){
    super(props)
    this.dateString = dateString.bind(this)
    this.handleSourceChange = this.handleSourceChange.bind(this) 
    this.handleStartChange = this.handleStartChange.bind(this)
    this.handleEndChange = this.handleEndChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.changesort = changesort.bind(this)
    this.paginate = Paginate.bind(this)
    this.updateDate = this.updateDate.bind(this)
  }
  componentDidMount() {
    let selections = this.props.homeSelections
    //todo() ordering
    this.props.fetchAllSources(
    "start_upload_date="+selections.startDate.toISOString()+
    "&end_upload_date="+selections.endDate.toISOString()+
    "&source__active=true"
    )
    this.props.fetchArticles(this.dateString(
        selections.orderdir,
        selections.ordercol,
        selections.sourceChosen,
        selections.page,
        selections.startDate,
        selections.endDate
        )) 
  }
  showArticle(event){
    event.preventDefault()
    
  }
  handleStartChange(date){
    let selections = this.props.homeSelections
    this.updateDate(date,selections.endDate, true)
    this.props.fetchArticles(this.dateString(
      ASC,
      '',
        selections.sourceChosen,
      1,
      date,
      selections.endDate
    )) 
    // update 
  }
  handleEndChange(date){
    let selections = this.props.homeSelections
    this.props.setHomeSelection({
      endDate:date
      })
    
    this.updateDate(selections.startDate,date,false)
    this.props.fetchArticles(this.dateString(
      ASC,
      '',
        selections.sourceChosen,
      1,
        selections.startDate,
      date
    )) 
  }

  updateDate(startDate,endDate,start_filter=true){
    //startdate - date
    //enddate - date
    //start_end - bool
    if (start_filter === true){
      if(startDate > endDate){
        endDate = startDate
      }
    } else {
      if(endDate < startDate){
        startDate = endDate
      }
    }
    this.props.fetchAllSources(
    "start_upload_date="+startDate.toISOString()+
    "&end_upload_date="+endDate.toISOString()+
    "&source__active=true"
    )
    this.props.setHomeSelections({endDate:endDate,startDate:startDate,page:1})

  }
  handleSourceChange(event){
    event.preventDefault()
    let selections = this.props.homeSelections
    this.props.setHomeSelections({
      sourceChosen:event.target.value,
      page:1
      })
    this.props.fetchArticles(dateString(selections.orderdir,
        selections.ordercol,
        event.target.value,
        1,
        selections.startDate,
        selections.endDate)) 

  }
  onSubmit(event){
    event.preventDefault()
  } 


  render(){
    let selections = this.props.homeSelections
    const articles = this.props.articlesList || [];
    const loading = typeof this.props.articlesLoading === 'undefined' ? true : this.props.articlesLoading;
    const totalcount= this.props.articlesTotalCount ||0;
    const next = this.props.articleNext ;
    const previous = this.props.articlePrevious;
    const errors = this.props.errors || {}
    return(
      <div className="container mt-2 col-sm-8 offset-sm-2" >
        <Form onSubmit={this.onSubmit} >
          {errors.non_field_errors?<Alert color="danger">{errors.non_field_errors}</Alert>:""}
       <Row>
        <Col>
          <label  htmlFor={"start_id"}>{"Start Date"}</label>
          <div className = "mb-2">
          <DatePicker id={"startDate"}  selected={selections.startDate} onChange={this.handleStartChange} />
          </div>
        </Col>
        <Col>
          <label  htmlFor={"end_id"}>{"End Date"}</label>
          <div className = "mb-2">
          <DatePicker  id={"endDate"}  selected={selections.endDate} onChange={this.handleEndChange}/>
          </div>
        </Col>

         <Col>
           <label  htmlFor={"source_id"}>{"Source"}</label> 
          <div >
           <Input type="select" name="Source" id="source_id" onChange={this.handleSourceChange}>
             <option value={""}>---</option>
             {this.props.sourcesList.map((source)=>{
               return ( <option key={source.id} 
                                value={source.id} selected={source.id.toString() === selections.sourceChosen? true: false}>
                                {source.name}</option>)
             })
             }
              </Input> 

          </div>
        </Col>
    </Row>
       <Row>
         {this.paginate(totalcount,
           next,
           previous,
           this.props.fetchArticles,
           this.props.fetchArticlesFullUri,
           this.dateString,
           this.props.homeSelections,
         this.props.setHomeSelections)}
       </Row>
        </Form>

       <Table>
         <thead>
           <tr>
             <td className="hover" onClick={(event)=>{this.changesort("title", 
               ASC, 
               DESC, 
               this.props.fetchArticles,
               selections,
               this.props.setHomeSelections
             )}}>Title</td>
           <td className="hover" onClick={(event)=>{this.changesort("source_name", 
             ASC, 
             DESC, 
             this.props.fetchArticles,
             selections,
               this.props.setHomeSelections
              )}}> Source </td>

           <td className="hover" onClick={(event)=>{this.changesort("upload_date", 
             ASC, 
             DESC, 
             this.props.fetchArticles,
             selections,
             this.props.setHomeSelections

           )}}>Date</td>
             <td >Classifications</td>
             <td >Children</td>
           </tr>
         </thead>
         { !loading ?
         <tbody>
           {
             articles.map((article)=>{
                return (<tr key={article.id}>
                  <td>
                      <Link key={article.id+"link"} style={{color:'black'}} to={this.props.articleuri+ article.id}>
                    {article.title}
                        </Link>
                      </td>
                  <td >
                    {article.source.name}
                  </td>
                  <td>{(new Date(article.upload_date)).toLocaleString()}</td>
                  <td>{article.categories.length}</td>
                  <td>{article.article_set.length}</td>

                </tr>)
             })
           }
        </tbody>
             : <Row><span className="spinner-border" role="status">
               <span className="sr-only">Loading...</span></span>
           </Row>
             }
       </Table>
    </div>
    )
 
 }
};

Main.propTypes = {
  articleList:propTypes.array,
  sourcesList:propTypes.array,
};
