import React from 'react'
import {shallow} from 'enzyme';
import {AppContainer} from '../Contents'
describe("create Contents", () => {
  it("renders", () =>{
    const wrapper = shallow(<AppContainer
      />);
    expect(wrapper.children().length).toBe(2)

  })
})

