import React  from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { PAGINATION } from '../util/util'
//
//
//CANNOT be an arrow function or 'this' will not work... dont ask how long i spent on that.
//CANNOT be part of a form as the onclick events cause page submissions.  2+ hours.
export default function  (totalcount,
  next,
  previous,
  fetchit, 
  fetchFullUri, 
  allSelections, 
  setPage, 
  child=false){
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
  let selections = child ? allSelections.child : allSelections
  if (typeof(fetchit) === 'undefined'){
    return <div> Loading</div>
  }
    return (
      <Pagination aria-label="Page navigation">
      <PaginationItem> 
        <PaginationLink first onClick={(event)=>{
          let newSel = child ? {...allSelections,
                              child:{
                                ...selections,
                                page:1}}:{...allSelections, page:1};
 
          fetchit(newSel,1)}} />
        </PaginationItem>
        <PaginationItem>
          {previous===null?
          <PaginationLink previous disabled  />
              :
              <PaginationLink previous  onClick={(event)=>{
                child ? setPage({...allSelections,
                              child:{
                                ...selections,
                                page:parseInt(selections.page)-1}}): setPage({...allSelections,
                                                                      page:allSelections.page-1});
                fetchFullUri(previous)}}/>
          }
        </PaginationItem>
       {list_pages.map((page)=>{
         let pageSel = parseInt(selections.page)
          if (page === 1 || page === total_pages || (page>= pageSel - 2 && page<= pageSel + 2)) {
            return (
              <div key={page}> 
            <PaginationItem active={page===pageSel} key={page}>
              <PaginationLink  
                onClick={(event)=>{
                  let newSel = child ? {...allSelections,
                              child:{
                                ...selections,
                                page:page}}:{...allSelections,page:page};
                  fetchit(newSel,page)}}>
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
                child ? setPage({...allSelections,
                              child:{
                                ...selections,
                                page:parseInt(selections.page)+1}}): setPage({...allSelections,page:selections.page+1})
                fetchFullUri(next)}} />
          }
        </PaginationItem>
        <PaginationItem>
          <PaginationLink last onClick={(event)=>{
            let newSel = child ? {...allSelections,
                              child:{
                                ...selections,
                                page:total_pages}}: {...allSelections, page:total_pages};
            fetchit(newSel,total_pages)}}/>
        </PaginationItem>

      </Pagination>
    )
  }

