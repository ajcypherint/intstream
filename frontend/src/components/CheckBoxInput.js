import React from 'react'
import { FormGroup, FormFeedback, Label, Input } from 'reactstrap';

export default ({name, label, type, ...rest}) => {
  const id = `id_${name}`,
        input_type = type?type:"checkbox"

  return (
    <FormGroup check>
      <Label  check>
      <Input type={input_type} name={name} id={id} {...rest} />
      {label}
      </Label>
    </FormGroup>
  )
} 
