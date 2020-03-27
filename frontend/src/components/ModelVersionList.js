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
    let selections = this.props.selections
    this.props.filterChange(
      selections
    )
  }  
  handleChange(event){
    let newSelections = {
      ...this.props.selections,
      mlmodelChosen:event.target.value,
      page:1
    }
    this.props.filterChange(newSelections)
  }
  handleActiveChange(event){
    // call action to update active model

  }
  onRefresh(event){
    event.preventDefault()
    this.props.filterChange(this.props.selections)
  }
  fetch(selections,page){
    let newSelections = {
      ...selections,
      page:page
    }
    this.props.filterChange(newSelections)
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
                    value={this.props.selections.mlmodelChosen}
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
               this.props.selections,
               this.props.setPage)}
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
                       this.props.selections,
                       this.props.filterChange,
                       0
                     )}}>
                     Model
                   </td>
                   <td>
                     Version Name
                   </td>
                   <td>
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
                                data-id={undefined}
                                data-articleid={version.id} 
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
