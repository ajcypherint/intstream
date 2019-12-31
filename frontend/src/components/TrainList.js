import React, { Component } from 'react';
import {Alert, Form, Row, Col, Button, FormGroup, Label, Input} from 'reactstrap';
import DatePicker from 'react-datepicker'
import {PAGINATION,dateString, addDays} from '../util/util'
import Paginate from './Paginate'
import {NONE} from "../reducers/trainFilter"
import {changesort} from './ChangeSort'
import {ASC, DESC, ALL} from "../util/util"
import { Link } from 'react-router-dom';

export default class extends Component {
  constructor(props){
    super(props)
    this.handleSourceChange = this.handleSourceChange.bind(this)
    this.handleModelChange = this.handleModelChange.bind(this)
    this.handleStartChange = this.handleStartChange.bind(this)
    this.handleEndChange = this.handleEndChange.bind(this)
    this.updateDate = this.updateDate.bind(this)
    this.paginate = Paginate.bind(this)
    this.changesort = changesort.bind(this)
  }
  handleModelChange(event){
    event.preventDefault()
    let id = event.target.value
    if(id!==NONE){
      let selections = this.props.selections
      //todo() ordering
      this.props.fetchAllSources(
      "start_upload_date="+selections.startDate.toISOString()+
      "&end_upload_date="+selections.endDate.toISOString()+
      "&source__active=true"
      )
      this.props.setSelections(
        {mlmodelChosen:id}
      )
      //todo add model 
     this.props.fetchArticles(dateString(selections.orderdir,
      selections.ordercol,
      selections.sourceChosen,
      1,
      selections.startDate,
      selections.endDate,
      )) 


    } else {
      this.props.clear()
      this.props.fetchAllMLModels("ordering=name&active=true")
      //todo clear articles

    }

  }
  handleStartChange(date){
    let selections = this.props.selections
    this.updateDate(date,selections.endDate, true)
  }
  handleEndChange(date){
    let selections = this.props.selections
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
        
    // todo add model
    this.props.fetchAllSources(
    "start_upload_date="+startDate.toISOString()+
    "&end_upload_date="+endDate.toISOString()+
    "&source__active=true"
    )
    // update cascading filters
    this.props.setSelections({
      page:1,
      startDate:startDate,
      endDate:endDate,
      })
    //fetch articles 
    //todo add model 
    this.props.fetchArticles(dateString(
      this.props.selections.orderdir,// orderdir
      this.props.selections.ordercol, // ordercol 
      this.props.selections.sourceChosen,// sourceChosen
      1,  // page
      startDate,
      endDate,
    )) 

 }
 
  handleSourceChange(event){
    event.preventDefault()
    //last filter.  do not need to unset others
    let selections = this.props.selections
    this.props.setSelections({
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

  }
  fetch(selections,page){
    this.props.fetchArticles(dateString(
            selections.orderdir,
            selections.ordercol,
            selections.sourceChosen,
            page,
            selections.startDate,
            selections.endDate,
            selections.threshold
          ))
  }
 
  componentDidMount(){

    //action
    this.props.fetchAllMLModels("ordering=name&active=true")
    // model = first model retrieved
  }
  render(){
    let articles = this.props.articlesList || [];
    const errors = this.props.articlesErrors || {}
    let selections = this.props.selections || {}
    let models = this.props.modelsList || []
    const ids = this.props.sourcesList.map(a=>a.id.toString()) ||[]
    const totalcount= this.props.articlesTotalCount ||0;
    const next = this.props.articleNext ;
    const previous = this.props.articlePrevious;
    const loading = this.props.articlesLoading
 
    return (

      <div className="container mt-2 col-sm-8 offset-sm-2" >

        {errors.error?<Alert color="danger">{errors.error}</Alert>:""}
        <Form>
       <FormGroup>
         <Row>
        <Col sm="2" >
          <label  htmlFor={"model_id"}>{"Model"}</label>
           <Input type="select" name="Model" value={selections.mlmodelChosen} id="source_id" onChange={this.handleModelChange}>
                <option value={NONE}>{NONE}</option>
             {
             models.map((model, index)=>{
              return (
                <option value={model.id} key={model.id}>{model.name}</option>
              )
             })
             }
           </Input>

        </Col>
        <Col sm="2">
          <label  htmlFor={"start_id"}>{"Start Date"}</label>
          <div className = "mb-2 ">
          <DatePicker style={{width:'100%'}} id={"startDate"}  selected={selections.startDate} onChange={this.handleStartChange} />
          </div>
        </Col>
        <Col sm="2">
          <label  htmlFor={"end_id"}>{"End Date"}</label>
          <div className = "mb-2 ">
          <DatePicker  id={"endDate"}  selected={selections.endDate} onChange={this.handleEndChange}/>
          </div>
        </Col>

         <Col sm="4" >
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
        <Col sm="2">
           <label  htmlFor={"target"}>{"Target"}</label> 
           <Input type="select" name="target" value={selections.target} id="target_id" onChange={this.handleTargetChange}>
             <option value={""}>---</option>
             <option value={true}>True</option>
             <option value={false}>False</option>
           </Input>
        </Col>
 
      </Row>
    </FormGroup>
    <table className={"table table-sm "}>
      <tbody>
        <tr>
          <td>
         {this.paginate(totalcount,
           next,
           previous,
           this.fetch,
           this.props.fetchArticlesFullUri,
           this.props.selections,
           this.props.setPage)}
         </td>
       </tr>
       <tr><td>
           <table className={"table table-sm"}>
         <thead>
           <tr>
             <td className="hover" onClick={(event)=>{this.changesort("title", 
               ASC, 
               DESC, 
               this.props.parent_func.fetchArticles,
               selections,
               this.props.parent_func.setHomeSelections,
             )}}>Title</td>
           <td className="hover" onClick={(event)=>{this.changesort("source__name", 
             ASC, 
             DESC, 
             this.props.parent_func.fetchArticles,
             selections,
              this.props.parent_func.setHomeSelections,
              )}}> Source </td>
           <td className="hover" onClick={(event)=>{this.changesort("upload_date", 
             ASC, 
             DESC, 
             this.props.parent_func.fetchArticles,
             selections,
             this.props.parent_func.setHomeSelections,
           )}}>Date</td>
             <td>True</td> 
             <td>False</td> 
           </tr>
         </thead>
         { !loading ?
             articles.map((article)=>{
               return (
                <tbody key={article.id}>
                <tr key={article.id}>
                 <td>
                      <Link key={article.id+"link"} style={{color:'black'}} to={this.props.articleuri+ article.id}>
                    {article.title}
                        </Link>
                      </td>
                  <td >
                    {article.source.name}
                  </td>
                  <td>{(new Date(article.upload_date)).toLocaleString()}</td>
                  <td>
                    <div class="custom-control custom-checkbox">
                      <Input type="checkbox" checked={false}/>
                    </div>
                  </td>
                  <td>
                    <div class="custom-control custom-checkbox">
                      <Input type="checkbox" checked={false}/>
                    </div>
                  </td>
               </tr>

                </tbody>
                 )
             })
             :<tbody><tr><td><span className="spinner-border" role="status">
               <span className="sr-only">Loading...</span></span>
           </td>
           </tr>
         </tbody>
             }
     </table>
   </td>
  </tr>
      </tbody>
    </table>
    </Form>
      </div>

    )
  }
}