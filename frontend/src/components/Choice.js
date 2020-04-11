import React from 'react'
import { FormGroup, FormFeedback, Label, Input } from 'reactstrap';

export default ({name, idList, uniqueList, value, onChange,disabled, ...rest}) => {
  value = value || ''
  return (
    <Input type="select" name={name} 
      value={value} 
      id={name+"_id"} 
      disabled={disabled}
      onChange={onChange}>
      <option  value={""}>---</option>
            {idList.includes(value)===false && value!==''? 
               <option  value={value}>{value}</option>:''}
             {uniqueList.map((item)=>{
               return ( <option  key={item.id} 
                                value={item.id}>
                                {item.name}</option>)
             })
             }
            
           </Input> 
    )
}
