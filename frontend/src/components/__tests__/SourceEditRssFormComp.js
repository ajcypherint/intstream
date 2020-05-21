import React from 'react'
import Main from '../SourceEditRSSFormComp'
import {shallow, mount} from 'enzyme';
describe("create ", () => {
  it("render", () =>{
    let handleChange=jest.fn()
    let saving=false
    let updating=false
    let object={
      id:1,
      name:"test",
      url:"test",
      active:true,
    }

    let goBack=jest.fn()
    let onSubmit=jest.fn()
    let wrapper = mount(
      <Main
        handleChange={handleChange}
        saving={saving}
        updating={updating}
        object={object}
        goBack={goBack}
        onSubmit={onSubmit}

      /> 
    )
    let input = wrapper.find("Input").at(0)
    input.simulate("change",{target:{value:"test"}})
    expect(handleChange.mock.calls.length).toBe(1)

  })

})
 
