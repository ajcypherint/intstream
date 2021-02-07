import Main from '../Submit'
import React from 'react'
import { shallow, mount, render } from 'enzyme'
describe('create ', () => {
  it('render ', () => {
    const wrapper = shallow(
      <Main
      />
    )
    expect(wrapper.children().length).toBe(1)
  })
})
