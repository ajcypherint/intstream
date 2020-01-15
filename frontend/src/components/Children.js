import React from 'react'
import _ from 'lodash';
import { Input, Table,  Alert, Form, Row, Col, FormGroup, Button, ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
import '../custom.css';
import Paginate from './Paginate'
import {PAGINATION, dateString, childString, addDays} from '../util/util'
import {changesort} from './ChangeSort'
import {ASC, DESC, ALL} from "../util/util"
import {createParent} from "../reducers/children"
import Match from "./Match"


export class Children extends React.Component{
  constructor(props){
    super(props)
    this.paginate = Paginate.bind(this)
    this.fetch = this.fetch.bind(this)
    this.childFetch = this.childFetch.bind(this)
    this.changesort = changesort.bind(this)
    this.showChildren = this.showChildren.bind(this)
    this.getArticle = this.getArticle.bind(this)
  }
  getArticle(event){
    let {id}= event.target.dataset
    this.props.clearSelect()
    this.props.fetchSelect(id)
  }
  showChildren(event){
    // call fetch for children based on level

    let {parent,level}= event.target.dataset
    let parentobj = JSON.parse(parent) //{id,title}
    let level_int = parseInt(level)
    //parentobj : {id,title}
    if( level== 0){
      this.props.child_func.clearParent()
      this.props.child_func.fetchArticles(parentobj, dateString(
      "",//orderdir
      "title", //ordercol
      this.props.parent.homeSelections.sourceChosen,
      1, //page
      this.props.parent.homeSelections.startDate,
      this.props.parent.homeSelections.endDate,
      ))
      this.props.child_func.setHomeSelections({
      page:1,
      orderCol:"title",
      startDate:this.props.parent.homeSelections.startDate,
      endDate:this.props.parent.homeSelections.endDate,
      sourceChosen:this.props.parent.homeSelections.sourceChosen
      })
    } else {
     this.props.parent_func.fetchArticles(parentobj, dateString(
      "",//orderdir
      "title", //ordercol
       this.props.source_chosen,
      1, //page
      this.props.start_date,
      this.props.end_date
      ))

    }
  }
  
  childFetch( selections, page){
    this.props.parent_func.fetchArticles(this.props.parent_obj, dateString(
      selections.orderdir,
      selections.ordercol,
      this.props.source_chosen,
      page,
      this.props.start_date,
      this.props.end_date//parent
      ))


  }
  fetch(selections,page){
    this.props.parent_func.fetchArticles(dateString(
            selections.orderdir,
            selections.ordercol,
            selections.sourceChosen,
            page,
            selections.startDate,
            selections.endDate,
            selections.threshold
          ))
  }
  render(){

    const level = this.props.level || 0
    let selections = this.props.parent.homeSelections
    const articles = this.props.parent.articlesList || [];
    const loading = typeof this.props.parent.articlesLoading === 'undefined' ? true : this.props.parent.articlesLoading;
    const totalcount= this.props.parent.articlesTotalCount ||0;
    const next = this.props.parent.articleNext ;
    const previous = this.props.parent.articlePrevious;
    const errors = this.props.parent.articlesErrors || {}
    let child = this.props.child || {}
    const parent_trail = this.props.parent_trail
    const parent_first_id = this.props.parent_trail.length > 0 ? parent_trail[0].id : -1
    const parent_last_obj = this.props.parent_trail.length > 0 ? parent_trail[parent_trail.length-1] : undefined
    const col_num = level===0 ? 8 : 11
    const cols = "col-sm-"+ col_num
    const offset_num = level === 0 ? 2 : 1
    const offset = "offset-sm-"+ offset_num
    const page_fetch = level === 0 ? this.fetch : this.childFetch
    const parent_obj = this.props.parent_obj || {}
    const parent_id = parent_obj.id || undefined
    const i = 1
    const selectArticles = this.props.selectArticles || {}
    return (
      
    <table className={"table table-sm "+cols + " " + offset}>
      <tbody>
        <tr>
          <td>
         {this.paginate(totalcount,
           next,
           previous,
           page_fetch,
           this.props.parent_func.fetchArticlesFullUri,
           this.props.parent.homeSelections,
           this.props.parent_func.setPage)}
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
               this.props.parent_func.fetchArticles,
               selections,
               this.props.parent_func.setHomeSelections,
               level,
               parent_last_obj
             )}}>Title</td>
           <td className="hover" onClick={(event)=>{this.changesort("source__name", 
             ASC, 
             DESC, 
             this.props.parent_func.fetchArticles,
             selections,
              this.props.parent_func.setHomeSelections,
              level,
             parent_last_obj
              )}}> Source </td>
           <td className="hover" onClick={(event)=>{this.changesort("upload_date", 
             ASC, 
             DESC, 
             this.props.parent_func.fetchArticles,
             selections,
             this.props.parent_func.setHomeSelections,
             level,
             parent_last_obj
           )}}>Date</td>
         {level===0 ? 
             <td >Similar Articles</td> : null}
           </tr>
         </thead>
         { !loading ?
             articles.map((article)=>{
               return (
                <tbody key={article.id}>
                <tr key={article.id}>
                 <td className="hover" data-id={article.id} onClick={this.getArticle}>
                    {article.title}
                      </td>
                  <td >
                    {article.source.name}
                  </td>
                  <td>{(new Date(article.upload_date)).toLocaleString()}</td>
                  <td>
                    <Match level={level} article={article} showChildren={this.showChildren}/>
                  </td>
               </tr>
                  {//todo selected article
                                 article.id in selectArticles ?
                                  <tr>
                                    {selectArticles[article.id].loading===true?
                                        <td>
                                          <span className="spinner-border" role="status">
                                            <span className="sr-only">Loading...</span>
                                          </span>
                                        </td>: 
                                          <td colSpan="5">
                                            <Input type="textarea" className="bktextarea" 
                                              name="text" rows="15" id="Article" readOnly 
                                              value={selectArticles[article.id].data.clean_text}/>
                                          </td>
                                    }
                                  </tr>
                                   : null
                                 //if article.id in this.props.selectArticles.keys()
                               }


                   { level === 0 && article.id === parent_first_id?
                      <tr>
                        <td colSpan="4">
                          <Children 
                             parent={this.props.child}
                             parent_func={this.props.child_func}
                             parent_obj={createParent(article.id,article.title,article.match)}
                             parent_title={article.title}
                             parent_trail={this.props.child.parentTrail}
                             start_date={selections.startDate}
                             end_date={selections.endDate}
                             source_chosen={selections.sourceChosen}

                             selectArticles={this.props.selectArticles}
                             selectErrors={this.props.selectErrors}
                             fetchSelect={this.props.fetchSelect}
                             clearSelect={this.props.clearSelect}

                             level={level+1}/>
                         </td>
                      </tr>
                             :
                             null
                   }                    
 
                </tbody>
                 )
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
    )
  }
}
 
