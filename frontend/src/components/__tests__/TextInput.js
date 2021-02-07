import TextInput from '../TextInput'
import React from 'react'
import { shallow } from 'enzyme'
describe('create TextInput', () => {
  it('renders', () => {
    const wrapper = shallow(<TextInput name={'testing'} label={'test'}/>)
    expect(wrapper.children().length).toBe(2)
  })
  it('error', () => {
    const wrapper = shallow(<TextInput
      name={'testError'} label={'testError'} error={'error msg'}/>)
    expect(wrapper.children().length).toBe(3)
  })
})
