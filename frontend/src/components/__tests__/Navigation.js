import Main from '../Navigation'
import React from 'react'
import { shallow, mount } from 'enzyme'
describe('create Navigation', () => {
  it('renders', () => {
    const wrapper = shallow(<Main
      isSuperUser={false}
      isStaff={false}
      isIntegrator={false}
    />)
    expect(wrapper.find('UncontrolledDropdown').length).toBe(1)
  })
  it('renders isIntegrator', () => {
    const wrapper = shallow(<Main
      isSuperUser={false}
      isStaff={false}
      isIntegrator={true}
    />)
    expect(wrapper.find('UncontrolledDropdown').length).toBe(3)
  })
  it('renders isStaff', () => {
    const wrapper = shallow(<Main
      isSuperUser={false}
      isStaff={true}
      isIntegrator={false}
    />)
    expect(wrapper.find('UncontrolledDropdown').length).toBe(2)
  })

  it('renders isSuperusers', () => {
    const wrapper = shallow(<Main
      isSuperuser={true}
      isStaff={false}
      isIntegrator={false}
    />)
    expect(wrapper.find('UncontrolledDropdown').length).toBe(2)
  })
})
