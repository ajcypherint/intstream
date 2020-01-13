import React, { Component } from 'react';
import {Alert, Form, Row, Col, Button, FormGroup, Label, Input} from 'reactstrap';
import DatePicker from 'react-datepicker'
import {PAGINATION,dateString, addDays} from '../util/util'
import Paginate from './Paginate'
import {NONE} from "../reducers/trainFilter"
import {changesort} from './ChangeSort'
import {ASC, DESC, ALL} from "../util/util"
import { Link } from 'react-router-dom';
import TrueFalse from "./TrueFalse"

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
    this.fetchit = this.fetchit.bind(this)
    this.getArticle = this.getArticle.bind(this)
    this.handleClassifChange = this.handleClassifChange.bind(this)
  }
  //todo remove classification
  handleClassifChange(event){
    let {articleid,mlmodel,truefalse,id}= event.target.dataset
    // if off then delete the classification
    if (truefalse === "true"){
      let target = event.target.checked 
      if(target){
        this.props.setClassif(mlmodel, articleid, true,
          dateString(this.props.selections.orderdir,
          this.props.selections.ordercol,
          this.props.selections.sourceChosen,
          this.props.selections.page,
          this.props.selections.startDate,
          this.props.selections.endDate,
          )+"&source__mlmodel="+mlmodel)
      } else {
        //remove classification
        this.props.deleteClassification(id, parseInt(articleid,10),
          dateString(this.props.selections.orderdir,
          this.props.selections.ordercol,
          this.props.selections.sourceChosen,
          this.props.selections.page,
          this.props.selections.startDate,
          this.props.selections.endDate,
          )+"&source__mlmodel="+mlmodel 
        )
      }
    }
    if (truefalse === "false"){
      let target = event.target.checked 
      if(target){
        this.props.setClassif(mlmodel, articleid, false,
          dateString(this.props.selections.orderdir,
          this.props.selections.ordercol,
          this.props.selections.sourceChosen,
          this.props.selections.page,
          this.props.selections.startDate,
          this.props.selections.endDate,
          )+"&source__mlmodel="+mlmodel 
        )
      } else {
        //remove classification
        this.props.deleteClassification(id, parseInt(articleid,10),
          dateString(this.props.selections.orderdir,
          this.props.selections.ordercol,
          this.props.selections.sourceChosen,
          this.props.selections.page,
          this.props.selections.startDate,
          this.props.selections.endDate,
          )+"&source__mlmodel="+mlmodel 
        )
      }
    }
  }
  handleModelChange(event){
    event.preventDefault()
    let id = event.target.value
    this.props.clearClassif()
    if(id!==NONE){
      let selections = this.props.selections
      //todo() ordering add model
      this.props.fetchAllSources(
      "start_upload_date="+selections.startDate.toISOString()+
      "&end_upload_date="+selections.endDate.toISOString()+
      "&source__mlmodel="+id+
      "&source__active=true"
      )
      this.props.setSelections(
        {mlmodelChosen:id}
      )
      //todo add model 
       this.props.fetchArticlesAndClassif(id,dateString(selections.orderdir,
        selections.ordercol,
        selections.sourceChosen,
        1,
        selections.startDate,
        selections.endDate,
        )+"&source__mlmodel="+id) 

    } else {
      this.props.clear() //selections
      this.props.fetchAllMLModels("ordering=name&active=true")
      this.props.clearArticles()

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
        
    this.props.fetchAllSources(
    "start_upload_date="+startDate.toISOString()+
    "&end_upload_date="+endDate.toISOString()+
      "&source__mlmodel="+this.props.selections.mlmodelChosen+
    "&source__active=true"
    )
    // update cascading filters
    this.props.setSelections({
      page:1,
      startDate:startDate,
      endDate:endDate,
      })
    //fetch articles 
    this.props.fetchArticlesAndClassif(this.props.selections.mlmodelChosen,
      dateString(
      this.props.selections.orderdir,// orderdir
      this.props.selections.ordercol, // ordercol 
      this.props.selections.sourceChosen,// sourceChosen
      1,  // page
      startDate,
      endDate,
    )+ "&source__mlmodel="+this.props.selections.mlmodelChosen)

 }
 
  handleSourceChange(event){
    event.preventDefault()
    //last filter.  do not need to unset others
    let selections = this.props.selections
    this.props.setSelections({
      sourceChosen:event.target.value,
      page:1
      })
    this.props.fetchArticlesAndClassif(selections.mlmodelChosen,
      dateString(selections.orderdir,
      selections.ordercol,
      event.target.value,
      1,
      selections.startDate,
      selections.endDate,
      )+ "&source__mlmodel="+selections.mlmodelChosen) 

  }
  getArticle(event){
    let {id}= event.target.dataset
    this.props.clearSelect()
    this.props.fetchSelect(id)
  }
  fetchit(selections,page){
    this.props.fetchArticlesAndClassif(selections.mlmodelChosen,dateString(
            selections.orderdir,
            selections.ordercol,
            selections.sourceChosen,
            page,
            selections.startDate,
            selections.endDate,
          )+"&source__mlmodel="+selections.mlmodelChosen)
  }
 
  componentDidMount(){
    //action
    this.props.clearClassif()
    this.props.fetchAllMLModels("ordering=name&active=true")
    let selections = this.props.selections
    if (selections.mlmodelChosen===NONE){
      this.props.clearArticles()
    } else {
      this.props.fetchArticlesAndClassif(selections.mlmodelChosen,
        dateString(
            selections.orderdir,
            selections.ordercol,
            selections.sourceChosen,
            selections.page,
            selections.startDate,
            selections.endDate,
          )+"&source__mlmodel="+selections.mlmodelChosen)
    }
  }
  render(){
    let articles = this.props.articlesList || [];
    const errors = this.props.articlesErrors || {}
    const classifErrors = this.props.classifErrors || {}
    let selections = this.props.selections || {}
    let models = this.props.modelsList || []
    const ids = this.props.sourcesList.map(a=>a.id.toString()) ||[]
    const totalcount= this.props.articlesTotalCount ||0;
    const next = this.props.articleNext ;
    const previous = this.props.articlePrevious;
    const loading = this.props.articlesLoading
    const selectArticles = this.props.selectArticles || {}
    const classifications = this.props.classif 
    const counts = this.props.classifCounts
    const true_pct = (counts.true_count / counts.total) * 100
    const false_pct = (counts.false_count / counts.total) * 100
    let i = 1
    return (

      <div className="container mt-2 col-sm-8 offset-sm-2" >

        {errors.non_field_errors?<Alert color="danger">{errors.non_field_errors}</Alert>:""}
        {classifErrors.non_field_errors?<Alert color="danger">{JSON.stringify(classifErrors.non_field_errors)}</Alert>:""}
        <Form>
       <FormGroup>
         <Row>
        <Col sm="3" >
          <label  htmlFor={"model_id"}>{"Model"}</label>
           <Input type="select" name="Model" value={selections.mlmodelChosen} id="model_id" onChange={this.handleModelChange}>
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
        <Col sm="3">
          <label  htmlFor={"start_id"}>{"Start Date"}</label>
          <div className = "mb-2 ">
          <DatePicker style={{width:'100%'}} id={"startDate"} disabled={selections.mlmodelChosen===NONE} selected={selections.startDate} onChange={this.handleStartChange} />
          </div>
        </Col>
        <Col sm="3">
          <label  htmlFor={"end_id"}>{"End Date"}</label>
          <div className = "mb-2 ">
          <DatePicker  id={"endDate"}  selected={selections.endDate} disabled={selections.mlmodelChosen===NONE}onChange={this.handleEndChange}/>
          </div>
        </Col>

         <Col sm="3" >
           <label  htmlFor={"source_id"}>{"Source"}</label> 
          <div >
           <Input type="select" name="Source" value={selections.sourceChosen} disabled={selections.mlmodelChosen===NONE} id="source_id" onChange={this.handleSourceChange}>
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
  </Form> {//this MUST be here.  the paginate function will cause page refreshes
  }
    <table className={"table table-sm "}>
      <tbody>
        <tr>
          <td>
         {this.paginate(totalcount,
           next,
           previous,
           this.fetchit,
           this.props.fetchArticlesFullUri,
           this.props.selections,
           this.props.setPage)}
         </td>
         <td align="left">
           <font>True: {isFinite(true_pct) ? true_pct.toFixed(1): ""}%</font>

         </td>
         <td align="left">
           <font>False: {isFinite(false_pct) ? false_pct.toFixed(1): ""}%</font>
         </td>
         <td align="left">
           <Button className="button-brand-primary mb-1" size="md">Train</Button>
         </td>
       </tr>
       <tr><td colSpan="4">
           <table className={"table table-sm"}>
         <thead>
           <tr>
             <td className="hover" onClick={(event)=>{this.changesort("title", 
               ASC, 
               DESC, 
               this.props.fetchArticles,
               selections,
               this.props.setSelections,
               0,
               undefined,
               "&source__mlmodel="+selections.mlmodelChosen
             )}}>Title</td>
           <td className="hover" onClick={(event)=>{this.changesort("source__name", 
             ASC, 
             DESC, 
             this.props.fetchArticles,
             selections,
             this.props.setSelections,
             0,
             undefined,
             "&source__mlmodel="+selections.mlmodelChosen
              )}}> Source </td>
           <td className="hover" onClick={(event)=>{this.changesort("upload_date", 
             ASC, 
             DESC, 
             this.props.fetchArticles,
             selections,
             this.props.setSelections,
             0,
             undefined,
             "&source__mlmodel="+selections.mlmodelChosen
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
                 <td className="hover" data-id={article.id} onClick={this.getArticle}>
                    {article.title}
                      </td>
                  <td >
                    {article.source.name}
                  </td>
                  <td>{(new Date(article.upload_date)).toLocaleString()}</td>
                  <TrueFalse trueFalse={true} 
                    articleId={article.id} 
                    classif={classifications}
                    mlModel={selections.mlmodelChosen}
                    handleChange={this.handleClassifChange}/>
                  <TrueFalse trueFalse={false} 
                    articleId={article.id} 
                    mlModel={selections.mlmodelChosen}
                    classif={classifications}
                    handleChange={this.handleClassifChange}/>
 
                </tr>
               {//todo selected article
                 article.id in selectArticles ?
                  <tr>
                    {selectArticles[article.id].loading===true?
                        <td>
                          <span className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                          </span>
                        </td>: 
                          <td colSpan="5">
                            <Input type="textarea" className="bktextarea" 
                              name="text" rows="15" id="Article" readOnly 
                              value={article.clean_text}/>
                          </td>
                    }
                  </tr>
                   : null
                 //if article.id in this.props.selectArticles.keys()
               }

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
      </div>

    )
  }
}
