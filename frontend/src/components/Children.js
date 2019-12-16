import React from 'react'
import _ from 'lodash';
import { Input, Table,  Alert, Form, Row, Col, FormGroup, Button, ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
import '../custom.css';
import Paginate from './Paginate'
import {PAGINATION, dateString, addDays} from '../util/util'
import {changesort} from './ChangeSort'
import {ASC, DESC, ALL} from "../util/util"


export class Children extends React.Component{
  constructor(props){
    super(props)
    this.paginate = Paginate.bind(this)
    this.fetch = this.fetch.bind(this)
    this.changesort = changesort.bind(this)
  }
  showChildren(parent,level){
    // call fetch for children based on level
    let i = 1
  }
  fetch(selections,page){
    this.props.parent_func.fetchArticles(dateString(
            selections.orderdir,
            selections.ordercol,
            selections.sourceChosen,
            page,
            selections.startDate,
            selections.endDate
          ))
  }
  render(){
    let selections = this.props.parent.homeSelections
    const articles = this.props.parent.articlesList || [];
    const loading = typeof this.props.parent.articlesLoading === 'undefined' ? true : this.props.parent.articlesLoading;
    const totalcount= this.props.parent.articlesTotalCount ||0;
    const next = this.props.parent.articleNext ;
    const previous = this.props.parent.articlePrevious;
    const errors = this.props.parent.articlesErrors || {}
    let child = this.props.child || {}
    const parent_trail = child.parentTrail || [-1]
    return (
      
      <tbody>
        <tr>
         {this.paginate(totalcount,
           next,
           previous,
           this.fetch,
           this.props.parent_func.fetchArticlesFullUri,
           this.props.parent.homeSelections,
           this.props.parent_func.setPage)}
       </tr>
      <tr>
       <Table>
         <thead>
           <tr>
             <td className="hover" onClick={(event)=>{this.changesort("title", 
               ASC, 
               DESC, 
               this.props.parent_func.fetchArticles,
               selections,
               this.props.parent_func.setHomeSelections
             )}}>Title</td>
           <td className="hover" onClick={(event)=>{this.changesort("source__name", 
             ASC, 
             DESC, 
             this.props.parent_func.fetchArticles,
             selections,
               this.props.parent_func.setHomeSelections
              )}}> Source </td>

           <td className="hover" onClick={(event)=>{this.changesort("upload_date", 
             ASC, 
             DESC, 
             this.props.parent_func.fetchArticles,
             selections,
             this.props.parent_func.setHomeSelections

           )}}>Date</td>
             <td >Children</td>
           </tr>
         </thead>
         { !loading ?
             articles.map((article)=>{
               return (
                <tbody key={article.id}>
                 <tr key={article.id}>
                  <td>
                      <Link key={article.id+"link"} style={{color:'black'}} to={this.props.parent.articleuri+ article.id}>
                    {article.title}
                        </Link>
                      </td>
                  <td >
                    {article.source.name}
                  </td>
                  <td>{(new Date(article.upload_date)).toLocaleString()}</td>
                   {
                       article.match.length > 0 ?
                       <td className="hover" onClick={this.showChildren.bind(this,article.id,this.props.level)}>{article.match.length}</td>
                           :
                       <td >{article.match.length}</td>
                          }
                </tr>
                   { this.props.level === 0 && article.id === parent_trail[0]?
                      <tr>
                            <Children parent={this.props.children}
                             parent_func={this.props.children_func}
                             level={this.props.level+1}/>
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
       </Table>
      </tr>
    </tbody>
    )
  }
}
 
