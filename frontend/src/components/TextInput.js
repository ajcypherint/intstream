import React from 'react'
import { FormGroup, FormFeedback, Label, Input } from 'reactstrap'

export default ({ name, label, error, type, ...rest }) => {
  const id = `id_${name}`
  const input_type = type || 'text'

  const invalid = error ? 'is-invalid' : ''
  return (
    <FormGroup>
      { label ? <Label htmlFor={id}>{label}</Label> : '' }
      <Input type={input_type} name={name} id={id} className={error ? 'is-invalid' : ''} {...rest} />
      { error ? <FormFeedback className="invalid-feedback">{error}</FormFeedback> : '' }
    </FormGroup>
  )
}
