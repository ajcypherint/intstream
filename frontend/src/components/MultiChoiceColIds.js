import React from 'react'
import { FormGroup, FormFeedback, Label, Input } from 'reactstrap'
import _ from 'lodash'

export default ({ name, values, label, id, value, onChange, disabled, type, error, incMitigated = false }) => {
  const listSorted = values.sort((a, b) => a.name > b.name ? 1 : -1)
  value = value || []
  // todo value.difference(valueList)
  // prepend  missing options to valueList b/c they are still selected
  return (
    <FormGroup>
      { label ? <Label htmlFor={id}>{label}</Label> : '' }

    <Input type="select" name={name} multiple
      data-type={type}
      value={value}
      id={name + '_id'}
      className={error ? 'is-invalid' : ''}
      disabled={disabled}
      onChange={onChange}>

            {
                 listSorted.map((item, index) => {
                   return (<option key={index}
                                value={item.id}>
                                {item.name}</option>)
                 })
            }

           </Input>
           { error && <FormFeedback className="invalid-feedback">{error}</FormFeedback> }
    </FormGroup>

  )
}
