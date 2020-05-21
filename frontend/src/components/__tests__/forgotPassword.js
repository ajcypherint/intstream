import Main from "../forgotPassword"
import React from 'react'
import {shallow, mount, render} from 'enzyme';
describe("create ", () => {
  it("renders", () =>{
    const sendEmail = jest.fn()
    const wrapper = mount(<Main
         sendEmail={sendEmail}
         history={{goBack:jest.fn()}}
      />);

    //todo change extra, validate state
    expect(wrapper.children().length).toBe(1)
    let email = wrapper.find('Input').at(0)
    email.simulate("change",{target:{name:"email",value:"test"}})
    expect(wrapper.state("email")).toBe("test")
    expect(wrapper.state("submitDisabled")).toBe(true)
    email.simulate("change",{target:{name:"email", value:"test@test.com"}})
    expect(wrapper.state("email")).toBe("test@test.com")
    expect(wrapper.state("submitDisabled")).toBe(false)
    //todo: find submit button and click
    //let submit= wrapper.find('button').at(0);
    //submit.simulate("submit")
    //expect(sendEmail.mock.calls.length).toBe(1)
 
  })
  it("renders errors", () =>{
    const error = "there was an error"
    const errors = {non_field_errors:error}
    const sendEmail = jest.fn()
    const wrapper = shallow(<Main
          sendEmail={sendEmail}
         history={{goBack:jest.fn()}}
         errors={errors}
          
      />);
    expect(wrapper.children().length).toBe(1)
    let alert = wrapper.find("Alert").at(0)
    expect(alert.children().text()).toBe(error)

  })

})

