import ModelVersionList from "../ModelVersionList"
import React from 'react'
import {shallow, mount} from 'enzyme';
describe("create ModelVersionList", () => {
  it("renders", () =>{
    let query = {}
    let setQuery = jest.fn()
    let modelList = [
      {
        id:1,
        name:"test",
      }
    ]
    let modelVersionList =[
      {
        id:1,
        model:{name:"test",id:1},
        version:1,
        status:"failed",
        metric_name:"test",
        metric_value:1,
        active:true
      }
    ]
    let modelVersionLoading = false
    let modelVersionErrors = {}
    let modelVersionTotalCount = 1
    let modelVersionNext = "http://test"
    let modelVersionPrevious = "http://prev"

    let filterChange = jest.fn()
    let fetchModelVersions = jest.fn()
    let setPage = jest.fn()
    let setActiveVersion = jest.fn()

    let wrapper = mount(
      <ModelVersionList
        query={query}
        setQuery={setQuery}
        modelsList={modelList}
        modelVersionList={modelVersionList}
        modelVersionLoading={modelVersionLoading}
        modelVersionErrors={modelVersionErrors}
        modelVersionTotalCount={modelVersionTotalCount}
        modelVersionNext={modelVersionNext}
        modelVersionPrevious={modelVersionPrevious}
        filterChange={filterChange}
        fetchModelVersions={fetchModelVersions}
        setPage={setPage}
        setActiveVersion={setActiveVersion}
      />
    )
    //todo - change sort
    expect(filterChange.mock.calls.length).toBe(1)
    let refresh = wrapper.find("Button").at(0)
    refresh.simulate("click")
    expect(filterChange.mock.calls.length).toBe(2)
    const firstcheck = wrapper.find('input').first()
    firstcheck.simulate("change", {target:{dataset:{model:1,id:1},checked:true}});
    expect(setActiveVersion.mock.calls.length).toBe(1)
 
    //todo - error test seperate
    //todo - test click checkbox

  })

})
