import React from 'react'
import _ from 'lodash';
import { Input, Table,  Alert, Form, Row, Col, FormGroup, Button, ListGroup, ListGroupItem } from 'reactstrap';
import propTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
import Paginate from './Paginate'
import {PAGINATION, dateString, addDays} from '../util/util'
import {changesort} from './ChangeSort'
const ALL = "---"
const ASC = ''
const DESC = '-'

export class Main extends React.Component{
  constructor(props){
    var start = new Date();
    start.setHours(0,0,0,0);

    var end = new Date();
    end.setHours(23,59,59,999);
    super(props)
    this.state={
      startDate: start,
      endDate: end,
      sources: [],
      sourceChosen:'',
      loadSources:false,
      page:1,
      ordercol:'',
      orderdir:ASC,
      next:null,
      previous:null
    }
    this.dateString = dateString.bind(this)
    this.handleSourceChange = this.handleSourceChange.bind(this) 
    this.handleStartChange = this.handleStartChange.bind(this)
    this.handleEndChange = this.handleEndChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.changesort = changesort.bind(this)
    this.paginate = Paginate.bind(this)
    this.updateDate = this.updateDate.bind(this)
  }
  componentWillMount() {
    this.props.fetchAllSources(
    
    )
    this.props.fetchArticles(this.dateString(
    this.state.orderdir,
        this.state.ordercol,
        this.state.sourceChosen,
      this.state.page,
        this.state.startDate,
      this.state.endDate
    )) 
  }
  handleStartChange(date){
    this.setState({
      startDate:date
    })
    this.updateDate(date,this.state.endDate, true)
    this.props.fetchArticles(this.dateString(
      ASC,
      '',
        this.state.sourceChosen,
      1,
      date,
      this.state.endDate
    )) 
    // update 
  }
  handleEndChange(date){
      this.setState({
      endDate:date
      })
    this.updateDate(this.state.startDate,date,false)
    this.props.fetchArticles(this.dateString(
      ASC,
      '',
        this.state.sourceChosen,
      1,
        this.state.startDate,
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
    this.setState({endDate:endDate,startDate:startDate,page:1})

  }
  handleSourceChange(event){
    event.preventDefault()
    this.setState({
      sourceChosen:event.target.value,
      page:1
      })
    this.props.fetchArticles(dateString(this.state.orderdir,
      this.state.ordercol,
        event.target.value,
        1,
        this.state.startDate,
      this.state.endDate)) 

  }
  onSubmit(event){
    event.preventDefault()
  } 


  render(){
    const articles = this.props.articlesList || [];
    const loading = typeof this.props.articlesLoading === 'undefined' ? true : this.props.articlesLoading;
    const error = this.props.articlesErrors;
    const totalcount= this.props.articlesTotalCount ||0;
    const next = this.props.articleNext ;
    const previous = this.props.articlePrevious;
    const sources = this.props.sourcesList || [];
    const allSourcesLoaded = typeof this.props.allSourcesLoaded === 'undefined' ? false : this.props.allSourcesLoaded;

     
    const errors = this.props.errors || {}
    return(
      <div className="container mt-2 col-sm-8 offset-sm-2" >
        <Form onSubmit={this.onSubmit} >
          {errors.non_field_errors?<Alert color="danger">{errors.non_field_errors}</Alert>:""}
       <Row>
        <Col>
          <label  htmlFor={"start_id"}>{"Start Date"}</label>
          <div className = "mb-2">
          <DatePicker id={"startDate"}  selected={this.state.startDate} onChange={this.handleStartChange} />
          </div>
        </Col>
        <Col>
          <label  htmlFor={"end_id"}>{"End Date"}</label>
          <div className = "mb-2">
          <DatePicker  id={"endDate"}  selected={this.state.endDate} onChange={this.handleEndChange}/>
          </div>
        </Col>

         <Col>
           <label  htmlFor={"source_id"}>{"Source"}</label> 
          <div >
           <Input type="select" name="Source" id="source_id" onChange={this.handleSourceChange}>
             <option value={""}>---</option>
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
           this.props.fetchArticles,
           this.props.fetchArticlesFullUri,
           this.dateString)}
       </Row>
        </Form>

       <Table>
         <thead>
           <tr>
             <td className="hover" onClick={(event)=>{this.changesort("title", 
               ASC, 
               DESC, 
               this.props.fetchArticles
             )}}>Title</td>
           <td className="hover" onClick={(event)=>{this.changesort("source_name", 
             ASC, 
             DESC, 
             this.props.fetchArticles)}}> Source </td>
           <td className="hover" onClick={(event)=>{this.changesort("upload_date", 
             ASC, 
             DESC, 
             this.props.fetchArticles)}}>Date</td>
             <td >Classifications</td>
             <td >Children</td>
           </tr>
         </thead>
         { !loading ?
         <tbody>
           {
             articles.map((article)=>{
                return (<tr key={article.id}>
                  <td>{article.title}</td>
                  <td>{article.source.name}</td>
                  <td>{(new Date(article.upload_date)).toLocaleString()}</td>
                  <td>{article.categories.length}</td>
                  <td>{article.article_set.length}</td>

                </tr>)
             })
           }
        </tbody>
             : <span className="spinner-border" role="status">
               <span className="sr-only">Loading...</span></span>
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
