import React from 'react'
import { FormGroup, FormFeedback, Label, Input } from 'reactstrap';


export default ({source, lookup, field,  orgprops, index, ...rest}) => {
  if (typeof source[field] ==='boolean'){
    return (
      <Input key={index} className='hover' type='checkbox' readOnly name={field} checked={source[field]} />
    )
  }
  if (lookup.includes(field)  ){
    const match = orgprops[field].filter(i=>i.id===source[field]) 
    let name = ""
    if( match.length ===1){
      name = match[0].name
    }
    return (<div> {name}  </div>)
  }
  return (<div>{source[field]}</div>)
 
}
