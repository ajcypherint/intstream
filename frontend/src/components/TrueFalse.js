import React from 'react'
import {createParent} from "../reducers/children"
import {Alert, Form, Row, Col, Button, FormGroup, Label, Input} from 'reactstrap';

export default ({trueFalse, articleId , classif, handleChange, mlModel}) => {
  let entry = classif[articleId] || undefined
  // not 
  if(typeof(entry) === "undefined"){
      return (
        <td>
          <div className="custom-control custom-checkbox">
            <Input type="checkbox" data-articleid={articleId} data-mlmodel={mlModel} data-truefalse={trueFalse} checked={false} onChange={handleChange}/>
           </div>
        </td>
      )

  }
  return (
      <td>
        <div className="custom-control custom-checkbox">
          <Input type="checkbox" data-articleid={articleId} data-truefalse={trueFalse} data-mlmodel={mlModel} 
            checked={entry.target===trueFalse} onChange={handleChange}/>
         </div>
      </td>
  )



  
}
