import React from 'react'
import _ from 'lodash';
import { Input,  Alert, Form, Row, Col, FormGroup,  } from 'reactstrap';
import propTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
import '../custom.css';
import { getOpts, dateString } from '../util/util'
import Choice from "./Choice"
import {getUniqueModels, getIdsModels} from "../util/util"
import {ASC, DESC, ALL} from "../util/util"
import Indicators from "./Indicators"
import Paginate from './Paginate'
export class Main extends React.Component{
  constructor(props){
    super(props)
    this.dateString = dateString.bind(this)
    this.handleSourceChange = this.handleSourceChange.bind(this) 
    this.handleModelChange = this.handleModelChange.bind(this) 
    this.handleStartChange = this.handleStartChange.bind(this)
    this.handleEndChange = this.handleEndChange.bind(this)
    this.updateDate = this.updateDate.bind(this)
    this.paginate = Paginate.bind(this)
    this.tabUpdate = this.tabUpdate.bind(this)
    this.fetch = this.fetch.bind(this)
    this.changeColChoice = this.changeColChoice.bind(this)
  }
  handleStartChange(date){
    let selections = this.props.query
    this.updateDate(date, selections.endDate, true)
  }
  handleEndChange(date){
    let selections = this.props.query
    this.updateDate(selections.startDate, date, false)
  }
  changeColChoice(event){
    
    let type = event.target.dataset.type
    let selected = getOpts(event)
	  let newSel = {
      [type]:selected,
      page:1
    }
    let selections ={
      ...this.props.query,
      ...newSel
    }
    //again here we set selections then fetch
    this.props.filterChange(selections, this.props.setQuery)
 
  }
  updateDate(startDate,endDate,start_filter=true){
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
        
    //Would be simpler to set selections first.
    //then fetchallsources
    //then fetchallarticles
    //using a thunk
    //
    //again here we set selections then fetchAllSources, fetchArticles
    let newSel = {
      page:1,
      startDate:startDate,
      endDate:endDate,
    }
    let selections = {
      ...this.props.query,
      ...newSel
     }
    this.props.filterChange(selections,this.props.setQuery )
  }
  updateComponent(){
    let START = new Date();
    START.setHours(0,0,0,0);

    let END= new Date();
    END.setHours(23,59,59,999);

    let ordering = this.props.query.ordering || "value"
    let page = this.props.query.page || 1
    let orderdir = this.props.query.orderdir || ""
    let sourceChosen =   this.props.query.sourceChosen || ""
    let modelChosen =   this.props.query.modelChosen || ""
    let startDate = this.props.query.startDate || START
    let endDate = this.props.query.endDate || END
    let next = this.props.query.next || ''
    let previous = this.props.query.previous || ''
    let selectedTabIndex = this.props.query.selectedTabIndex || "md5"
    let selectedTabIndexNum = this.props.query.selectedTabIndexNum || 0 
    let numCols = this.props.query.numCols || []
    let textCols = this.props.query.textCols || []
    //todo: check if intersection of selected cols and possible cols
    let numColsObjs = this.props.numCols
    let textColsObjs = this.props.textCols
    let numColsList = []

    let selections = {
      ordering:ordering, 
      page:page, 
      orderdir:orderdir,
      sourceChosen:sourceChosen,
      modelChosen:modelChosen,
      startDate:startDate,
      endDate:endDate,
      next:next,
      previous:previous,
      selectedTabIndex:selectedTabIndex,
      selectedTabIndexNum:selectedTabIndexNum,
      numCols:numCols,
      textCols:textCols
    }
    this.props.filterChange(selections, this.props.setQuery )
 
  }
  componentDidMount() {
    this.updateComponent()
  }
  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (typeof this.props.query.page === 'undefined' && typeof prevProps.query.page !== 'undefined') {
      this.updateComponent();
    }
  }
 
  handleModelChange(event){
    let newSel = {
      modelChosen:event.target.value,
      page:1
    }
    let selections ={
      ...this.props.query,
      ...newSel
    }
    //again here we set selections then fetch
    this.props.filterChange(selections, this.props.setQuery )
  }

  handleSourceChange(event){
    //again we set selections then fetchArticles
    let newSel = {
      sourceChosen:event.target.value,
      page:1
    }
    let selections = {
      ...this.props.query,
      ...newSel
    }
    this.props.filterChange(selections, this.props.setQuery)
  }

  tabUpdate(index, lastIndex, event) {
    let newSel = {
      selectedTabIndex:event.target.dataset.value,
      selectedTabIndexNum:index,
      page:1
    }
    let selections = {
      ...this.props.query,
      ...newSel
    }
    this.props.filterChange(selections, 
      this.props.setQuery, 
      )
 
  }
 
  //parent for paginate
  fetch(selections,page){
    this.props.filterChange(selections, this.props.setQuery)
  }
 
  render(){

    const selections = this.props.query
    const errors = this.props.indicatorsErrors || {}

    const uniqueSources = _.uniqBy(this.props.sourcesList,'id')
    const ids = uniqueSources.map(a=>a.id.toString()) ||[]

    let uniqueModels = getUniqueModels(this.props.sourcesList)
    let idsModels = getIdsModels(uniqueModels)
 
    return(
    <div className="container mt-2 col-sm-12" >
    <Form onSubmit={this.onSubmit} >
          {errors.detail?<Alert color="danger">{errors.detail}</Alert>:""}
          {errors.non_field_errors?<Alert color="danger">{errors.non_field_errors}</Alert>:""}
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

         <Col sm="2" md="2" lg="3">
           <label  htmlFor={"source_id"}>{"Source"}</label> 
          <div >
            <Choice name={"Source"} 
              disabled={false}
              value={selections.sourceChosen}
              onChange={this.handleSourceChange}
              idList={ids}
              uniqueList={uniqueSources}
            />
           </div>
        </Col>
        <Col sm="2" md="2" lg="2">
           <label  htmlFor={"model_id"}>{"Model"}</label> 
           <div>
             <Choice name={"Model"}
               disabled={false}
               value={selections.modelChosen}
               onChange={this.handleModelChange}
               idList={idsModels}
               uniqueList={uniqueModels}
             />
        </div>
        </Col>
     </Row>
  </FormGroup>
  </Form>
      <Indicators
        fetchit={this.fetch}
        fetchIndicatorsFullUri={this.props.fetchIndicatorsFullUri}
        selections={selections}
        setQuery={this.props.setQuery}
        paginate={this.paginate}
        indicatorsList={this.props.indicatorsList}
        indicatorsLoading={this.props.indicatorsLoading}
        indicatorsNext={this.props.indicatorsNext}
        indicatorsPrevious={this.props.indicatorsPrevious}
        indicatorsTotalCount={this.props.indicatorsTotalCount}
        tabUpdate={this.tabUpdate}
        md5={this.props.md5}
        sha1={this.props.sha1}
        sha256={this.props.sha256}
        ipv4={this.props.ipv4}
        ipv6={this.props.ipv6}
        netloc={this.props.netloc}
        email={this.props.email}
        filterChange={this.props.filterChange}
        changeColChoice={this.changeColChoice}
        numCols={this.props.numCols}
        textCols={this.props.textCols}
        query={this.props.query}
      />
  </div>
    )
 
 }
};

Main.propTypes = {
  sourcesList:propTypes.array,
  indicatorsList:propTypes.array,
  indicatorsLoading:propTypes.bool,
  indicatorsTotalCount:propTypes.number,
  indicatorsNext:propTypes.string,
  indicatorsPrevious:propTypes.string,
  fetchAllSources: propTypes.func,
  filterChange:propTypes.func,
  fetchIndicatorsFullUri:propTypes.func,
  fetchIndicators:propTypes.func,
  md5:propTypes.object,
  sha1:propTypes.object,
  sha256:propTypes.object

};
