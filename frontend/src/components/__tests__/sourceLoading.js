import { SourceLoading } from '../sourceLoading'
import React from 'react'
import { shallow, mount, render } from 'enzyme'
describe('create ', () => {
  it('render ', () => {
    const wrapper = shallow(
      <SourceLoading
        heading={'test'}
      />
    )
    expect(wrapper.children().length).toBe(3)
  })
})
