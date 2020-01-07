import React from 'react'
import {createParent} from "../reducers/children"
import {Alert, Form, Row, Col, Button, FormGroup, Label, Input} from 'reactstrap';

export default ({trueFalse ,articleId ,classif,handleChange}) => {
  let entry = classif[articleId] || undefined
  // not 
  if(typeof(entry) === "undefined"){
      return (
        <td>
          <div className="custom-control custom-checkbox">
            <Input type="checkbox" data-articleId={articleId} checked={false} onClick={handleChange}/>
           </div>
        </td>
      )

  }
  return (
      <td>
        <div className="custom-control custom-checkbox">
          <Input type="checkbox" data-articleId={articleId} checked={entry.data.target===trueFalse} onClick={handleChange}/>
         </div>
      </td>
  )



  
}
