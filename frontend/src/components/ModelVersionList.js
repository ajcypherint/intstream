import React, { Component } from 'react';
import _ from 'lodash';
import {filterChange} from '../actions/modelVersionFilter'
import {Alert, Form, Row, Col, Button, FormGroup, Label, Input} from 'reactstrap';
import Choice from "./Choice"
import Paginate from './Paginate'
import {ASC, DESC, ALL } from "../util/util"
import {changesort} from './ChangeSort'

export default class extends Component {
  constructor(props){
    super(props)
    this.fetch = this.fetch.bind(this)
    this.paginate = Paginate.bind(this)
    this.handleActiveChange = this.handleActiveChange.bind(this)
    this.onRefresh = this.onRefresh.bind(this)
    this.changesort = changesort.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }
  componentDidMount(){
    let selections = this.props.query
    let ordering = this.props.query.ordering || "name"
    let page = this.props.query.page || 1
    let orderDir = this.props.query.orderDir || ""
    let mlmodelChosen = this.props.query.mlmodelChosen || ""
    let newSel = {
      ...selections,
      ordering:ordering,
      page:page,
      orderDir:orderDir,
      mlmodelChosen:mlmodelChosen
    }
 
    this.props.filterChange(
      newSel,this.props.setQuery
    )
  }  
  handleChange(event){
    let newSelections = {
      ...this.props.query,
      mlmodelChosen:event.target.value,
      page:1
    }
    this.props.filterChange(newSelections,this.props.setQuery)
  }
  handleActiveChange(event){

    let {model, id}= event.target.dataset
    this.props.setActiveVersion(model,
                                id, 
                                this.props.query) 
  }
  onRefresh(event){
    event.preventDefault()
    this.props.filterChange(this.props.query, this.props.setQuery)
  }
  fetch(selections,page){
    let newSelections = {
      ...selections,
      page:page
    }
    this.props.filterChange(newSelections, this.props.setQuery)
  }
 
  render(){
    const totalcount = this.props.modelVersionTotalCount  
    const idsModels = this.props.modelsList.map(a=>a.id.toString()) ||[]
    const uniqueModels = _.uniqBy(this.props.modelsList,'id')
    const errors = this.props.modelVersionErrors || {}
    const next = this.props.modelVersionNext;
    const previous = this.props.modelVersionPrevious;
    const loading = typeof this.props.modelVersionLoading === 'undefined' ? true : this.props.modelVersionLoading;
    const modelVersionList = this.props.modelVersionList || []
    
    return (
      <div className="container mt-2 col-sm-12 " >
          {errors.non_field_errors?<Alert color="danger">{errors.non_field_errors}</Alert>:""}
          <Form>
            <FormGroup>
              <Row className={"col-sm-8 offset-sm-2"}>
                <Col  >
                   <Choice name={"Model"}
                    value={this.props.query.mlmodelChosen || ''}
                    onChange={this.handleChange}
                    idList={idsModels}
                    uniqueList={uniqueModels}
                    disabled={false}
                   />
                </Col>
                <Col>
                </Col>
                <Col>
                </Col>
                <Col>
                  <Button disabled={loading} type="submit" onClick={this.onRefresh} className="button-brand-primary mb-1" size="md">
                  {loading ?                       
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                       :""
                  }Refresh
                   </Button>
                </Col>
              </Row>
            </FormGroup>
          </Form>
        <Row className={"col-sm-8 offset-sm-2"}>
        <table className={"table table-sm"}>
          <tbody>
            <tr>
              <td>
             {this.paginate(totalcount,
               next,
               previous,
               this.fetch,
               this.props.fetchModelVersions,
               this.props.query,
               this.props.setQuery)}
             </td>
           </tr>
           <tr>
             <td>
             <table className={"table table-sm"}>
               <thead>
                 <tr>
                   <td className="hover" onClick={(event)=>{this.changesort("title", 
                       ASC, 
                       DESC, 
                       this.props.query,
                       this.props.filterChange,
                       this.props.setQuery,
                       0
                     )}}>
                     Model
                   </td>
                   <td className="hover" onClick={(event)=>{this.changesort("version", 
                       ASC, 
                       DESC, 
                       this.props.query,
                       this.props.filterChange,
                       this.props.setQuery,
                       0
                     )}}>
                     Version Name
                   </td>
                   <td className="hover" onClick={(event)=>{this.changesort("status", 
                       ASC, 
                       DESC, 
                       this.props.query,
                       this.props.filterChange,
                       this.props.setQuery,
                       0
                     )}}>
                     Status
                   </td>
                  <td>
                     Metric 
                   </td>
                   <td>
                     Value
                   </td>
                   <td>
                     Active
                   </td>
                 </tr>
               </thead>
                 { !loading ?
                    modelVersionList.map((version)=>{
                      let metric_value = version.metric_value || 0
                      return (
                        <tbody key={version.id}>
                           <tr key={version.id}>
                             <td>
                               {version.model.name}
                             </td>
                             <td >
                                {version.version}
                             </td>
                             <td>
                               {version.status}
                             </td>
                             <td >
                                {version.metric_name}
                             </td>
                             <td>
                               {metric_value.toFixed(3)}
                             </td>
                          <td>
                            <div className="custom-control custom-checkbox">
                              <Input type="checkbox" 
                                data-model={version.model.id}
                                data-id={version.id}
                                checked={version.active} 
                                onChange={this.handleActiveChange}/>
                             </div>
                         </td>
                            </tr>
                        </tbody>)
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
        </Row>
      </div>
    )

  }

}
