import React from 'react'
import Main from '../OrgUserEditFormComp'
import {shallow, mount} from 'enzyme';
describe("create OrgEditForm", () => {
  it("render", () =>{
    let handleChange=jest.fn()
    let saving=false
    let updating=false
    let object={
      id:1,
      name:"test",
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
    expect(handleChange.mock.calls.length).toBe(0)
    input = wrapper.find("Input").at(1)
    input.simulate("change",{target:{value:"test"}})
    expect(handleChange.mock.calls.length).toBe(1)
    input = wrapper.find("Input").at(2)
    input.simulate("change",{target:{value:"test"}})
    expect(handleChange.mock.calls.length).toBe(2)
    input = wrapper.find("Input").at(3)
    input.simulate("change",{target:{value:"test"}})
    expect(handleChange.mock.calls.length).toBe(3)
    input = wrapper.find("Input").at(4)
    input.simulate("change",{target:{value:"test"}})
    expect(handleChange.mock.calls.length).toBe(4)
 
  })

})
 
