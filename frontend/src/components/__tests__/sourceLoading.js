import Main from "../sourceLoading"
import React from 'react'
import {shallow, mount, render} from 'enzyme';
describe("create ", () => {
  it("render ", () =>{
    let wrapper = shallow(
      <sourceLoading
        heading={"test"}
      />
    )
    expect(wrapper.children().length).toBe(1)
  })



})
 
