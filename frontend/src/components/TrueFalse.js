import React from 'react'
import {createParent} from "../reducers/children"
import {Alert, Form, Row, Col, Button, FormGroup, Label, Input} from 'reactstrap';

export default ({trueFalse ,articleId ,classif}) => {
  if(typeof(classif) === "undefined"){
    return (
        <td>
          <div className="custom-control custom-checkbox">
            <Input type="checkbox" checked={false}/>
           </div>
        </td>
      )
  }
  let entry = classif[articleId] || undefined
  // not 
  if(typeof(entry) === "undefined"){
      return (
        <td>
          <div className="custom-control custom-checkbox">
            <Input type="checkbox" checked={false}/>
           </div>
        </td>
      )

  }
  return (
      <td>
        <div className="custom-control custom-checkbox">
          <Input type="checkbox" checked={entry.data.target===trueFalse}/>
         </div>
      </td>
  )



  
}
