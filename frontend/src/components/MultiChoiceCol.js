import React from 'react'
import { FormGroup, FormFeedback, Label, Input } from 'reactstrap'
import _ from 'lodash'

export default ({ name, valueList, value, onChange, disabled, type, incMitigated = false }) => {
  value = value || []
  // todo value.difference(valueList)
  // prepend  missing options to valueList b/c they are still selected
  const inList = []
  const mitigated = [{ name: 'mitigated' }]
  for (let i = 0; i < valueList.length; i++) {
    inList.push(valueList[i].name)
  }
  const extra = _.difference(value, inList)
  const extraObjs = []
  for (let i = 0; i < extra.length; i++) {
    const e = { name: extra[i] }
    extraObjs.unshift(e)
  }
  // possibly mitigated can be a required column?
  //  if (incMitigated) {
  // valueList = _.concat(extraObjs, mitigated, valueList)
  // } else {
  valueList = _.concat(extraObjs, valueList)
  // }
  return (
    <Input type="select" name={name} multiple
      data-type={type}
      value={value}
      id={name + '_id'}
      disabled={disabled}
      onChange={onChange}>

            {
                 valueList.map((item, index) => {
                   return (<option key={index}
                                value={item.name}>
                                {item.name}</option>)
                 })
            }

           </Input>
  )
}
