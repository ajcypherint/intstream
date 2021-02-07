import Main from '../Match'
import React from 'react'
import { shallow, mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
describe('create Article', () => {
  it('renders', () => {
    const article = {
      id: 1,
      match: [1, 2, 3],
      title: 'test'

    }
    const wrapper = shallow(
      <Main
        article={article}
        level={0}
        showChildren={false}
      />
    )
    expect(wrapper.children().length).toBe(1)
  })
})
