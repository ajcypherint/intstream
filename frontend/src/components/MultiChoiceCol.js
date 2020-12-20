import React from 'react';
import { FormGroup, FormFeedback, Label, Input } from 'reactstrap';
import _ from "lodash";

export default ({name, valueList, value, onChange, disabled, type, ...rest}) => {
  value = value || []
  //todo value.difference(valueList)
  //prepend  missing options to valueList b/c they are still selected
  let inList = []
  for(let i=0;i<valueList.length;i++){
    inList.push(valueList[i].name)
  }
  let extra = _.difference(value,inList)
  valueList = _.concat(extra, valueList)
  return (
    <Input type="select" name={name} multiple
      data-type={type}
      value={value} 
      id={name+"_id"} 
      disabled={disabled}
      onChange={onChange}>

      
            {
                 valueList.map((item, index)=>{
                  return ( <option  key={index} 
                                value={item.name}>
                                {item.name}</option>)
                  })
            }
            
           </Input> 
    )
}
