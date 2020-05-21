import Main from "../CreateMLVersion"
import React from 'react'
import {shallow, mount, render} from 'enzyme';
describe("create ", () => {
  it("renders", () =>{
    const fetchModel = jest.fn()
    const trainRedirect = jest.fn()
    const wrapper = mount(<Main
      match={{params:{id:1}}}
      modelsList={[{name:"test",id:1}]}
      fetchModel={fetchModel}
      trainRedirect={trainRedirect}
          
      />);
    //todo change extra, validate state
    expect(wrapper.children().length).toBe(1)
    let submit= wrapper.find('button');
    submit.simulate("submit")
    expect(trainRedirect.mock.calls.length).toBe(1)
    let metric = wrapper.find('Input').at(0)
    metric.simulate("change",{target:{value:"test"}})
    expect(wrapper.state("metric")).toBe("test")
   })
  it("renders errors", () =>{
    const error = "there was an error"
    const fetchModel = jest.fn()
    const trainRedirect = jest.fn()
    const wrapper = shallow(<Main
      trainCreateErrors={{detail:error}}
      match={{params:{id:1}}}
      modelsList={[{name:"test",id:1}]}
      fetchModel={fetchModel}
      trainRedirect={trainRedirect}
          
      />);
    expect(wrapper.children().length).toBe(2)
    expect(fetchModel.mock.calls.length).toBe(1)
    let alert = wrapper.find("Alert").at(0)
    expect(alert.children().text()).toBe(error)

  })

})

