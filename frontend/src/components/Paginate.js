import React  from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { PAGINATION } from '../util/util'
//
//
//CANNOT be an arrow function or 'this' will not work... dont ask how long i spent on that.
export default function  (totalcount,next,previous,fetchit, fetchFullUri, selections, setSelections){
  //
  // totalcount: int
  // next:str
  // previous:str
  // fetchit: func
  // fetchFullUri: func
  // dateStringFunc: func
  // selections: object
  // setSelections: func
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
          setSelections({page:1});
          fetchit(selections,1)}} />
        </PaginationItem>
        <PaginationItem>
          {previous===null?
          <PaginationLink previous disabled  />
              :
              <PaginationLink previous  onClick={(event)=>{
                setSelections({page:selections.page-1});
                fetchFullUri(previous)}}/>
          }
        </PaginationItem>
       {list_pages.map((page)=>{
          if (page === 1 || page=== total_pages || (page>= selections.page - 2 && page<= selections.page + 2)) {
            return (
              <div key={page}> 
            <PaginationItem active={page===selections.page} key={page}>
              <PaginationLink  
                onClick={(event)=>{
                  setSelections({page:page});
                  fetchit(selections,page)}}>
                {page }
              </PaginationLink>
            </PaginationItem>
          </div>
            );
          }
          })
        }
        <PaginationItem>
          {next === null?
            <PaginationLink next disabled  />
              :
              <PaginationLink next onClick={(event)=>{
                setSelections({page:selections.page+1})
                fetchFullUri(next)}} />
          }
        </PaginationItem>
        <PaginationItem>
          <PaginationLink last onClick={(event)=>{
            setSelections({page:total_pages});
            fetchit(selections,total_pages)}}/>
        </PaginationItem>

      </Pagination>
    )
  }

