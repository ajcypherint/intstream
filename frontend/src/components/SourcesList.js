import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'reactstrap';
import _ from 'lodash';
import propTypes from 'prop-types'
import {FormGroup,Container,Button} from 'reactstrap'
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { PAGINATION } from '../util/util'
import { Input } from 'reactstrap';
const ASC = ''
const DESC = '-'
class SourcesList extends Component {
  constructor(props){
    super(props)
    this.displaysources = this.displaysources.bind(this)
    this.setpage = this.setpage.bind(this)
    this.state={page:1,ordercol:'',orderdir:ASC}
    this.changesort = this.changesort.bind(this)
    this.columnheader = this.columnheader.bind(this)
  }
 
  componentDidMount() {
    this.props.fetchSources();
    this.setState({page:1,ordercol:'',orderdir:ASC})
  }
  
  displaysources(sources, fields, loading){
    //rows
    //todo(aj) onChange for checkbox
    if (loading) {
      return <span className="spinner-border" role="status">
               <span className="sr-only">Loading...</span></span>

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
   if (this.state.ordercol===column_name) {
      // column matches sort column opposite
      if( this.state.orderdir===ASC){
       this.setState({orderdir:DESC})
       this.props.fetchSources(
            "ordering="+DESC+column_name+"&page="+this.state.page)
        //call desc sort
        }
      else{
       this.setState({orderdir:ASC})
       this.props.fetchSources(
            "ordering="+ASC+column_name+"&page="+this.state.page)
        //call asc sort
      }
    }
    else{
      //sort by this column ascending; first time sorting this column
       this.setState({ordercol:column_name,orderdir:ASC}) 
       this.props.fetchSources(
            "ordering="+ASC+column_name+"&page="+this.state.page)
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
  setpage(page){
    this.setState({page:page})
  }
  pagination(totalcount,next,previous){
    let total_pages = Math.ceil(totalcount / PAGINATION)
    
    let pre_list_pages = [...Array(total_pages).keys()]

    let list_pages = pre_list_pages.map((i)=>{ return i+1})
    return (
      <Pagination aria-label="Page navigation example">
      <PaginationItem>
        <PaginationLink first onClick={(event)=>{this.setpage(1);
          this.props.fetchSources("ordering="+this.state.orderdir+this.state.ordercol+"&page=1")}} />
        </PaginationItem>
        <PaginationItem>
          {previous==null?
          <PaginationLink previous disabled  />
              :
              <PaginationLink previous  onClick={(event)=>{this.setpage(this.state.page-1);
                this.props.fetchSourcesFullUri(previous)}}/>
          }
        </PaginationItem>
        {list_pages.map((page)=>{
          return (
          <PaginationItem active={page===this.state.page} key={page}>
            <PaginationLink  
              onClick={(event)=>{
                this.setpage(page);
                this.props.fetchSources("ordering="+this.state.orderdir+this.state.ordercol+"&page="+page)}}>
              {page }
            </PaginationLink>
          </PaginationItem>
          );
          })
        }

        <PaginationItem>
          {next===null?
            <PaginationLink next disabled  />
              :
              <PaginationLink next onClick={(event)=>{this.setpage(this.state.page+1);
                this.props.fetchSourcesFullUri(next)}} />
          }
        </PaginationItem>
        <PaginationItem>
          <PaginationLink last onClick={(event)=>{
            this.setpage(total_pages);
            this.props.fetchSources("ordering="+this.state.orderdir+this.state.ordercol+"&page="+total_pages)}}/>
        </PaginationItem>

      </Pagination>
    )
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


    return (
      <div className="container">
      { !_.isEmpty(error) ? <div className="alert alert-danger">Error: {error.message}</div>: ''}
        <h1>{heading}</h1>
       {totalcount ? this.pagination(totalcount,next,previous): ''}
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
