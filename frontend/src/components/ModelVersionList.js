import React, { Component } from 'react';
import _ from 'lodash';
import {filterChange} from '../actions/modelVersionFilter'
import {Alert, Form, Row, Col, Button, FormGroup, Label, Input} from 'reactstrap';
import Choice from "./Choice"

export default class extends Component {
  constructor(props){
    super(props)
 
  }
  componentDidMount(){
    let selections = this.props.selections
    this.filterChange(
      selections
    )
  }
  render(){
    
    const idsModels = this.props.modelsList.map(a=>a.id.toString()) ||[]
    const uniqueModels = _.uniqBy(this.props.modelsList,'id')
    const errors = this.props.modelVersionErrors || {}
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
        </Row>
  
      </div>
    )

  }

}
