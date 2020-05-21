import Main from "../LoginForm"
import React from 'react'
import {shallow, mount} from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
describe("create", () => {
  it("renders", () =>{
    const onSubmit= jest.fn()
    const wrapper = mount(
      <MemoryRouter>
      <Main
        onSubmit = {onSubmit}
      />
    </MemoryRouter>
    );
    let submit= wrapper.find('button');
    submit.simulate("submit")
    expect(onSubmit.mock.calls.length).toBe(1)
  
  })
})

