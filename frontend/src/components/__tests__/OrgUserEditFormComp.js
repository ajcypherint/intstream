import React from 'react'
import Main from '../OrgUserEditFormComp'
import { shallow, mount } from 'enzyme'
describe('create OrgEditForm', () => {
  it('render', () => {
    const handleChange = jest.fn()
    const saving = false
    const updating = false
    const object = {
      id: 1,
      name: 'test',
      active: true
    }

    const goBack = jest.fn()
    const onSubmit = jest.fn()
    const wrapper = mount(
      <Main
        handleChange={handleChange}
        saving={saving}
        updating={updating}
        object={object}
        goBack={goBack}
        onSubmit={onSubmit}

      />
    )
    let input = wrapper.find('Input').at(0)
    input.simulate('change', { target: { value: 'test' } })
    expect(handleChange.mock.calls.length).toBe(0)
    input = wrapper.find('Input').at(1)
    input.simulate('change', { target: { value: 'test' } })
    expect(handleChange.mock.calls.length).toBe(1)
    input = wrapper.find('Input').at(2)
    input.simulate('change', { target: { value: 'test' } })
    expect(handleChange.mock.calls.length).toBe(2)
    input = wrapper.find('Input').at(3)
    input.simulate('change', { target: { value: 'test' } })
    expect(handleChange.mock.calls.length).toBe(3)
    input = wrapper.find('Input').at(4)
    input.simulate('change', { target: { value: 'test' } })
    expect(handleChange.mock.calls.length).toBe(4)
  })
})
