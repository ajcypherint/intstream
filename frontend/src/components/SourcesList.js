import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'reactstrap';
import _ from 'lodash';
import propTypes from 'prop-types'
import {FormGroup,Container,Button,Row} from 'reactstrap'
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import Paginate from './Paginate'
import { PAGINATION } from '../util/util'
import { Input } from 'reactstrap';
const ASC = '+'
const DESC = '-'
class SourcesList extends Component {
  constructor(props){
    super(props)
    this.displaysources = this.displaysources.bind(this)
    this.changesort = this.changesort.bind(this)
    this.columnheader = this.columnheader.bind(this)
    this.paginate = Paginate.bind(this)
    this.noop = this.noop.bind(this)
    this.fetch = this.fetch.bind(this)
  }
 
  componentDidMount() {
    //set up defaults if not query not set
    let ordering = this.props.query.ordering || "name"
    let page = this.props.query.page || 1
    let orderDir = this.props.query.orderDir || "+"
    this.props.setQuery({page:page, ordering:ordering, orderDir:orderDir})
    this.props.fetchSources(
            "ordering="+orderDir+ordering+"&page="+page)
  }
  
  displaysources(sources, fields, loading){
    //rows
    //todo(aj) onChange for checkbox
    if (loading) {
      return <tr>
              <td>
                <span className="spinner-border" role="status">
               <span className="sr-only">Loading...</span></span>
              </td>
           </tr>

    } else{
    return sources.map((source)=>{
      return (
            <tr key={source.id}>
              {fields.map((field, index)=>{
                  return (
                      <td key={index} >
                      <Link key={index} style={{color:'black'}} to={this.props.edituri + source.id}>
                        {typeof source[field] ==='boolean'?
                                <Input key={index} className='hover' type='checkbox' readOnly name={field} checked={source[field]} />
                             : source[field]}
                      </Link>
                    </td>
                  )})}
            </tr>
          );
    });
    }
  }
  changesort(column_name){
    console.log("clicked")
   if (this.props.query.ordering===column_name) {
      // column matches sort column opposite
      if( this.props.query.orderDir===ASC){
       this.props.setQuery({orderDir:DESC})
       this.props.fetchSources(
            "ordering="+DESC+column_name+"&page="+this.props.query.page)
        //call desc sort
        }
      else{
       this.props.setQuery({orderDir:ASC})
       this.props.fetchSources(
            "ordering="+ASC+column_name+"&page="+this.props.query.page)
        //call asc sort
      }
    }
    else{
      //sort by this column ascending; first time sorting this column
       this.props.setQuery({orderDir:ASC,ordering:column_name})
       this.props.fetchSources(
            "ordering="+ASC+column_name+"&page="+this.props.query.page)
        //call asc sort
      }
  }
  
  columnheader(name){
      return (
             <th key={name} className="tableheader" onClick={(event)=>{console.log("click1");this.changesort(name)}}>
                  {name.charAt(0).toUpperCase() + name.slice(1)}
             </th>
      )
 
  }
  noop(){

  }
  fetch(selections,page){
    this.props.fetchSources("ordering="+selections.orderDir+selections.ordering+"&page="+page)
  }
  render() {
    const heading = this.props.heading;
    const fields = this.props.fields;
    const sources = this.props.sourcesList;
    const loading = typeof this.props.sourcesLoading === 'undefined' ? true : this.props.sourcesLoading;
    const error = this.props.sourcesErrors;
    const totalcount= this.props.totalCount;
    const next = this.props.next;
    const previous = this.props.previous;
    const { ordering:ordering } = this.props.query;



    return (
      <div className="container">
      { !_.isEmpty(error) ? <div className="alert alert-danger">Error: {error.message}</div>: ''}
        <h1>{heading}</h1>
        {totalcount ?
            this.paginate(totalcount,
           next,
           previous,
           this.fetch,
           this.props.fetchSourcesFullUri,
              {page:this.props.query.page,
                orderDir:this.props.query.orderDir,
                ordering:this.props.query.ordering}, //selections
         this.props.setQuery) 
            : ''}
          <FormGroup>
        <Button tag={Link} to={this.props.addUri} className="button-brand-primary" size="md">Add</Button>
      </FormGroup>
 
        <Table>
          <thead>
            <tr>
              {fields.map(this.columnheader)}
            </tr>
          </thead>
          <tbody>
          {this.displaysources(sources, fields, loading) }
        </tbody>
        </Table>
      </div>
    );
  }
}

SourcesList.propTypes = {
  heading:propTypes.string,
  fields:propTypes.arrayOf(propTypes.string),
  sourceList:propTypes.arrayOf(propTypes.shape({
    name:propTypes.string,
    id:propTypes.number,
    })),
  sourcesLoading:propTypes.bool,
  totalCount:propTypes.number,
  error:propTypes.shape({message:propTypes.string}),
  next:propTypes.string,
  previous:propTypes.string,
  fetchSources:propTypes.func,
  fetchSourcesFullURI:propTypes.func,
  clearSources:propTypes.func,
  addUri:propTypes.string,
  editUri:propTypes.string
};
export default SourcesList;
