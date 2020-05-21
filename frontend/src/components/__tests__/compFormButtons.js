import Buttons from "../compFormButtons"
import React from 'react'
import {shallow, mount} from 'enzyme';
describe("create Choice", () => {
  it("renders saving true", () =>{
    const goBackf = jest.fn()
    const submit = jest.fn()

    const wrapper = mount(<Buttons 
      saving={false}
      goBack={goBackf}
      submit={submit}
      />);
    expect(wrapper.children().length).toBe(1)
  })
})

