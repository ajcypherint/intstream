import React from 'react'
import Main from '../SourceEditRSSFormComp'
import { shallow, mount } from 'enzyme'
describe('create ', () => {
  it('render', () => {
    const handleChange = jest.fn()
    const saving = false
    const updating = false
    const object = {
      id: 1,
      name: 'test',
      url: 'test',
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
    const input = wrapper.find('Input').at(0)
    input.simulate('change', { target: { value: 'test' } })
    expect(handleChange.mock.calls.length).toBe(1)
  })
})
