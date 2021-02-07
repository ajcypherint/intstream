import Main from '../Main'
import React from 'react'
import { shallow, mount } from 'enzyme'
import { MemoryRouter } from 'react-router-dom'
describe('create Article', () => {
  it('renders', () => {
    const wrapper = shallow(
      <MemoryRouter>
      <Main
      />
    </MemoryRouter>
    )
    // todo - this shallow render isn't testing anything really
    // syntax checks still run on the import, I guess.
    expect(wrapper.exists()).toBe(true)
  })
})
