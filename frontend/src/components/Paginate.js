import React  from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { PAGINATION } from '../util/util'
//
//state:
//  orderdir: str
//  ordercol: str
//  page: int
//
//
//CANNOT be an arrow function or 'this' will not work... dont ask how long i spent on that.
export default function  (totalcount,next,previous,fetchit, fetchFullUri){
  //
  //totalcount: int
  //next:str
  //previous:str
  //fetchit: func
  //fetchFullUri: func
  //
  //
    let total_pages = Math.ceil(totalcount / PAGINATION)
    
    let pre_list_pages = [...Array(total_pages).keys()]

    let list_pages = pre_list_pages.map((i)=>{ return i+1})
  if (typeof(fetchit) === 'undefined'){
    return <div> Loading</div>
  }
    return (
      <Pagination aria-label="Page navigation">
      <PaginationItem>

        <PaginationLink first onClick={(event)=>{
          this.setState({page:1});
          fetchit("ordering="+this.state.orderdir+this.state.ordercol+"&page=1")}} />
        </PaginationItem>
        <PaginationItem>
          {previous===null?
          <PaginationLink previous disabled  />
              :
              <PaginationLink previous  onClick={(event)=>{
                this.setState({page:this.state.page-1});
                fetchFullUri(previous)}}/>
          }
        </PaginationItem>
       {list_pages.map((page)=>{
          return (
          <PaginationItem active={page===this.state.page} key={page}>
            <PaginationLink  
              onClick={(event)=>{
                this.setState({page:page});
                fetchit("ordering="+this.state.orderdir+this.state.ordercol+"&page="+page)}}>
              {page }
            </PaginationLink>
          </PaginationItem>
          );
          })
        }


        <PaginationItem>
          {next === null?
            <PaginationLink next disabled  />
              :
              <PaginationLink next onClick={(event)=>{
                this.setState({page:this.state.page+1})
                fetchFullUri(next)}} />
          }
        </PaginationItem>
        <PaginationItem>
          <PaginationLink last onClick={(event)=>{
          this.setState({page:total_pages});
            fetchit("ordering="+this.state.orderdir+this.state.ordercol+"&page="+total_pages)}}/>
        </PaginationItem>

      </Pagination>
    )
  }

