import React from 'react'
import { FormGroup, FormFeedback, Label, Input } from 'reactstrap'

export default ({ name, error, idList, uniqueList, value, onChange, disabled, noAllValues, ...rest }) => {
  for (var i = 0; i < idList.length; i++) idList[i] = parseInt(idList[i], 10)
  value = parseInt(value)
  let prop = 'name'
  if (typeof rest.prop !== 'undefined') {
    prop = rest.prop
  }
  const uniqueListSorted = uniqueList.sort((a, b) => a[prop] > b[prop] ? 1 : -1)
  value = value || ''
  return (
    <FormGroup>
    <Label htmlFor={name}>{name}</Label>
    <Input type="select" name={name}
      value={value}
      className={error ? 'is-invalid' : ''}
      id={name + '_id'}
      disabled={disabled}
      onChange={onChange}>
      {noAllValues ? null : <option value={''}>---</option>}
            {idList.includes(value) === false && value !== '' && <option value={value}>{value}</option>
              }
             {uniqueList.map((item) => {
               return (<option key={item.id}
                                value={item.id}>
                                {item[prop]}</option>)
             })
             }

           </Input>
          { error && <FormFeedback className="invalid-feedback">{error}</FormFeedback>
          }
     </FormGroup>
  )
}
