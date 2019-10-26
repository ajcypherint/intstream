import React  from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { PAGINATION } from '../util/util'
//
//state:
//  orderdir: str
//  ordercol: str
//  page: int
//  startDate: date
//  endDate: date
//
//
//CANNOT be an arrow function or 'this' will not work... dont ask how long i spent on that.
export default function  (totalcount,next,previous,fetchit, fetchFullUri, dateStringFunc){
  //
  //totalcount: int
  //next:str
  //previous:str
  //fetchit: func
  //fetchFullUri: func
  //dateStringFunc: func
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
          fetchit(dateStringFunc(
            this.state.orderdir,
            this.state.ordercol,
            this.state.sourceChosen,
            1,
            this.state.startDate,
            this.state.endDate
          )
          )}} />
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
                fetchit(dateStringFunc(
                  this.state.orderdir,
                  this.state.ordercol,
                  this.state.sourceChosen,
                  page,
                  this.state.startDate,
                  this.state.endDate
                )
                )}}>
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
            fetchit(dateStringFunc(
                  this.state.orderdir,
                  this.state.ordercol,
                  this.state.sourceChosen,
                  total_pages,
                  this.state.startDate,
                  this.state.endDate
            ))}}/>
        </PaginationItem>

      </Pagination>
    )
  }

