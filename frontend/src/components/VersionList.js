import React, { Component } from 'react';
import _ from 'lodash';
import {filterChange} from '../actions/modelVersionFilter'
import {Alert, Form, Row, Col, Button, FormGroup, Label, Input} from 'reactstrap';
import Choice from "./Choice"
import {withRouter} from 'react-router-dom'
import Paginate from './Paginate'
import {ASC, DESC, ALL } from "../util/util"
import {changesort} from './ChangeSort'
import propTypes from 'prop-types'

class VersionList extends Component {
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
    let ordering = this.props.query.ordering || "id"
    let page = this.props.query.page || 1
    let orderdir = this.props.query.orderdir || ""
    let chosen = this.props.query.chosen || ""
    let newSel = {
      ...selections,
      ordering:ordering,
      page:page,
      orderdir:orderdir,
      chosen:chosen
    }
 
    this.props.filterChange(
      newSel,this.props.setQuery
    )
  }  
  handleChange(event){
    let newSelections = {
      ...this.props.query,
      chosen:event.target.value,
      page:1
    }
    this.props.filterChange(newSelections,this.props.setQuery)
  }
  handleActiveChange(event){

    let {model, id}= event.target.dataset
    this.props.setActiveVersion(model,
      id, 
      this.props.query,
      this.props.setQuery) 
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
    const id = this.props.query.id || undefined
    const name = this.props.query.name || undefined
    const totalcount = this.props.VersionTotalCount  
    const errors = this.props.VersionErrors || {}
    const next = this.props.VersionNext;
    const previous = this.props.VersionPrevious;
    const loading = typeof this.props.VersionLoading === 'undefined' ? true : this.props.VersionLoading;
    const VersionList = this.props.VersionList || []
    
    return (
     <div className="container mt-2 col-sm-12 " >
 
          {errors.non_field_errors?<Alert color="danger">{errors.non_field_errors}</Alert>:""}
          <Form>
            <FormGroup className={"col-sm-8 offset-sm-2"}>
              <Row>
                <Col colSpan={4}>
                  {name && <h2>{name}</h2>}
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
               this.props.fetchVersions,
               this.props.query,
               this.props.setQuery)}
             </td>
           </tr>
           <tr>
             <td>
               {React.cloneElement(this.props.table,
                   {
                      VersionList:this.props.VersionList,
                      VersionLoading:this.props.VersionLoading,
                      query:this.props.query,
                      history:this.props.history,
                      List:this.props.List,

                      setQuery:this.props.setQuery,
                      handleActiveChange:this.handleActiveChange,
                      setPage:this.props.setPage,


                   }
                 )
                }

             </td>
            </tr>
          </tbody>
        </table>
        </Row>
      </div>
    )

  }

}

VersionList.propTypes = {
  List:propTypes.arrayOf(propTypes.shape(

  )),
  VersionList:propTypes.arrayOf(propTypes.object),
  VersionLoading:propTypes.bool,
  VersionErrors:propTypes.object,
  VersionTotalCount:propTypes.number,
  VersionNext:propTypes.string,
  VersionPrevious:propTypes.string,

  filterChange:propTypes.func,
  fetchVersions:propTypes.func,
  setPage:propTypes.func,
  setActiveVersion:propTypes.func

};

export default withRouter(VersionList);
