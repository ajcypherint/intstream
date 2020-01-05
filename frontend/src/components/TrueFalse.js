import React from 'react'
import {createParent} from "../reducers/children"
import {Alert, Form, Row, Col, Button, FormGroup, Label, Input} from 'reactstrap';

export default ({value}) => {
  return (
          <td>
            <div className="custom-control custom-checkbox">
              <Input type="checkbox" checked={value}/>
             </div>
          </td>
  )

}
