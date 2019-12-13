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
    this.fetch = this.fetch.bind(this)
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
  }
  handleEndChange(date){
    let selections = this.props.homeSelections
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
    this.props.setHomeSelections({
      page:1,
      startDate:startDate,
      endDate:endDate,
      })
    //fetch articles 
    this.props.fetchArticles(this.dateString(
      this.props.homeSelections.orderdir,// orderdir
      this.props.homeSelections.ordercol, // ordercol 
      this.props.homeSelections.sourceChosen,// sourceChosen
      1,  // page
      startDate,
      endDate
    )) 

 }
  handleSourceChange(event){
    //last filter.  do not need to unset others
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
  fetch(selections,page){
    this.props.fetchArticles(dateString(
            selections.orderdir,
            selections.ordercol,
            selections.sourceChosen,
            page,
            selections.startDate,
            selections.endDate
          ))
  }
  render(){
    let selections = this.props.homeSelections
    const articles = this.props.articlesList || [];
    const loading = typeof this.props.articlesLoading === 'undefined' ? true : this.props.articlesLoading;
    const totalcount= this.props.articlesTotalCount ||0;
    const next = this.props.articleNext ;
    const previous = this.props.articlePrevious;
    const errors = this.props.articlesErrors || {}
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
       <Row>
         {this.paginate(totalcount,
           next,
           previous,
           this.fetch,
           this.props.fetchArticlesFullUri,
           this.props.homeSelections,
           this.props.setPage)}
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
           <td className="hover" onClick={(event)=>{this.changesort("source__name", 
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
                  <td>{article.match.length}</td>
                </tr>)
             })
           }
        </tbody>
             :<tbody><tr><td><span className="spinner-border" role="status">
               <span className="sr-only">Loading...</span></span>
           </td>
           </tr>
         </tbody>
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
