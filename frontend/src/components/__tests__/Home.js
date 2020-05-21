import {Main} from "../Home"
import React from 'react'
import {shallow, mount} from 'enzyme';
describe("create Home", () => {

  it("renders", () =>{
    const setQuery = jest.fn()
    const query={ }
    const sourcesList = [{
      id:1,
      name:"test",
      mlmodel_id:1,
      mlmodel:1,
      target:true,
    mlmodel_active:true}]
    const fetchAllSources = jest.fn()

    const filterChange = jest.fn()
    const clearSelect = jest.fn()
    const fetchSelect = jest.fn()
    const selectArticles= []
    const selectErrors= jest.fn()

    const fetchArticles = jest.fn()
    const fetchFullArticles = jest.fn()
    const setHomeSelections = jest.fn()
    const setPage = jest.fn()

    const parent = {
      articlesList:[{id:1,
        title:"test",
        text:"test",
        upload_date:new Date(),
        source:{name:"test"}}],
      articlesLoading:false,
      articleNext:"http://test",
      articlePrevious:"http://test",
      articlesTotalCount:3,
      articleuri:"test/",
    }
    const parent_func = {
      fetchArticlesFullUri:fetchFullArticles,
      fetchArticles:fetchArticles, 
      setHomeSelections:setHomeSelections,
      setPage:setPage,
 
    }

    const childfetchArticles = jest.fn()
    const childfetchFullArticles = jest.fn()
    const childsetHomeSelections = jest.fn()
    const childsetPage = jest.fn()
    const childclearParent = jest.fn()

    const child = {}
    const child_func = {
      fetchArticlesFullUri:childfetchFullArticles,
      fetchArticles:childfetchArticles, 
      setHomeSelections:childsetHomeSelections,
      setPage:childsetPage,
      clearParent:childclearParent
    }
 
    const wrapper = mount(
      <Main 
        query={query}
        sourcesList={sourcesList}
        selectArticles={selectArticles}
        selectErrors={selectErrors}
        parent={parent}
        child={child}
        fetchAllSources={fetchAllSources}
        filterChange={filterChange}
        parent_func={parent_func}
        child_func={child_func}
      />
    );
    expect(wrapper.children().length).toBe(1)
    //todo - test sourcechange
    let sourceInput = wrapper.find("Input").at(0);
    sourceInput.simulate("change",{target:{value:1}})
    expect(childclearParent.mock.calls.length).toBe(1)
    expect(filterChange.mock.calls.length).toBe(2)
    let modelInput = wrapper.find("Input").at(1);
    modelInput.simulate("change",{target:{value:1}})
    expect(childclearParent.mock.calls.length).toBe(2)
    expect(filterChange.mock.calls.length).toBe(3)
 
    //todo - test modelchange
    //todo - test startDate change
    //todo - test endDate change
    //todo - test maxDf change
    //validate mindf and maxdf are disabled
    let minDfC = wrapper.find("Input").at(3)
    let maxDfC = wrapper.find("Input").at(4)
    expect(minDfC.prop("disabled")).toBe(true)
    expect(maxDfC.prop("disabled")).toBe(true)
    //test threshold change
    let thresholdC = wrapper.find("Input").at(2)
    thresholdC.simulate("change",{target:{value:20}})
    expect(childclearParent.mock.calls.length).toBe(3)
    expect(filterChange.mock.calls.length).toBe(4)
 
    //todo - validate mindf and maxdf are


  })
})

