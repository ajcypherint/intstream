import React from 'react'
import _ from 'lodash';
import { Input, Table,  Alert, Form, Row, Col, FormGroup, Button, ListGroup, ListGroupItem } from 'reactstrap';
import propTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
import Paginate from './paginate'
import {PAGINATION} from '../util/util'
import {changesort} from './changeSort'

const ASC = ''
const DESC = '-'

export class Main extends React.Component{
  constructor(props){
    super(props)
    this.state={
      startDate: new Date(),
      endDate: new Date(),
      sources: [],
      sourceChosen:undefined,
      loadSources:false,
      page:1,
      ordercol:'',
      orderdir:ASC,
      next:null,
      previous:null,
      orderdir:ASC,
      ordercol:''
    }
    this.handleSourceChange = this.handleSourceChange.bind(this) 
    this.handleStartChange = this.handleStartChange.bind(this)
    this.handleEndChange = this.handleEndChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.changesort = changesort.bind(this)
    this.paginate = Paginate.bind(this)

  }
  componentWillMount() {
    this.props.fetchAllSources()
    this.props.fetchArticles() 
  }
  handleStartChange(date){
    this.setState({
      startDate:date
    })
  }
  handleEndChange(date){
    this.setState({
      endDate:date
    })
  }

  handleSourceChange(event){
    event.preventDefault()
    this.setState({
      sourceChosen:event.target.value,
      })
  }
  onSubmit(event){
    event.preventDefault()
  } 


  render(){
    const articles = this.props.articlesList || [];
    const loading = this.props.articlesLoading||true;
    const error = this.props.articlesErrors;
    const totalcount= this.props.articlesTotalCount ||0;
    const next = this.props.articleNext ;
    const previous = this.props.articlePrevious;
    const sources = this.props.sourcesList || [];
    const allSourcesLoaded = this.props.allSourcesLoaded || false;

    if(!_.isEmpty(error)) {
      return <div className="alert alert-danger">Error: {error.message}</div>
    }
     
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
             {this.props.sourcesList.map((source)=>{
               return ( <option key={source.id} 
                                value={source.id}>
                                {source.name}</option>)
             })
             }
              </Input> 

          </div>
        </Col>
      <Col className="center">
        <Button type="submit" className="button-brand-primary "  size="md">Filter</Button>
      </Col>
    </Row>
       <Row>
         {this.paginate(totalcount,
           next,
           previous,this.props.fetchArticles,this.props.fetchArticlesFullUri)}
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
           <td className="hover" onClick={(event)=>{this.changesort("upload_date", 
             ASC, 
             DESC, 
             this.props.fetchArticles)}}>Date</td>
             <td >Classifications</td>
             <td >Children</td>
           </tr>
         </thead>
         <tbody>
           {
             articles.map((article)=>{
         return (<tr key={article.id}>
                  <td>{article.title}</td>
                  <td>{article.upload_date}</td>
                  <td>{article.categories.length}</td>
                  <td>{article.article_set.length}</td>

                </tr>)
             })
           }
       </tbody>
       </Table>
    </div>
    )
 
 }
};

Main.propTypes = {
  articleList:propTypes.array,
  sourcesList:propTypes.array,
};
