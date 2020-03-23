import React, { Component } from 'react';
import _ from 'lodash';
import {filterChange} from '../actions/modelVersionFilter'
import {Alert, Form, Row, Col, Button, FormGroup, Label, Input} from 'reactstrap';
import Choice from "./Choice"

export default class extends Component {
  constructor(props){
    super(props)
    this.fetch = this.fetch.bind(this)
 
  }
  componentDidMount(){
    let selections = this.props.selections
    this.filterChange(
      selections
    )
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
    
    return (
      <div className="container mt-2 col-sm-12 " >
        <Row className={"col-sm-8 offset-sm-2"}>
          {errors.non_field_errors?<Alert color="danger">{errors.non_field_errors}</Alert>:""}
          <Form>
            <FormGroup>
              <Row>
                <Col sm="3" >
                   <Choice name={"Model"}
                    value={this.props.selections.modelChosen}
                    onChange={this.handleTFChange}
                    idList={idsModels}
                    uniqueList={uniqueModels}
                    disabled={false}
                   />
                </Col>
              </Row>
            </FormGroup>
          </Form>
        </Row>
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
               this.props.Selections,
               this.props.setPage)}
             </td>
           </tr>
           <tr>
             <td>
             <table className={"table table-sm"}>
               <thead>
                 <tr>
                 </tr>
               </thead>
                 { !loading ?
                    this.props.modelVersionList.map((version)=>{
                      return (<tbody key={version.id}>
                    

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
