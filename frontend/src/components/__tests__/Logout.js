import {AppContainer} from "../Logout"
import React from 'react'
import {shallow, mount} from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
describe("create", () => {
  it("renders", () =>{
    const logout= jest.fn()
    const wrapper = mount(

      <MemoryRouter>
      <AppContainer
        logout_m={logout}
      />
    </MemoryRouter>
    );
    expect(logout.mock.calls.length).toBe(1)
  
  })
})

