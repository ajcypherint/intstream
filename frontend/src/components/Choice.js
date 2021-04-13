import React from 'react'
import { FormGroup, FormFeedback, Label, Input } from 'reactstrap'

export default ({ name, error, idList, uniqueList, value, onChange, disabled, noAllValues, ...rest }) => {
  let prop = 'name'
  if (rest.prop !== 'undefined') {
    prop = rest.prop
  }
  const uniqueListSorted = uniqueList.sort((a, b) => a[prop] > b[prop] ? 1 : -1)
  value = value || ''
  return (
    <Input type="select" name={name}
      value={value}
      className={error ? 'is-invalid' : ''}
      id={name + '_id'}
      disabled={disabled}
      onChange={onChange}>
      {noAllValues ? null : <option value={''}>---</option>}
            {idList.includes(value) === false && value !== ''
              ? <option value={value}>{value}</option>
              : ''}
             {uniqueList.map((item) => {
               return (<option key={item.id}
                                value={item.id}>
                                {item[prop]}</option>)
             })
             }

           </Input>
  )
}
