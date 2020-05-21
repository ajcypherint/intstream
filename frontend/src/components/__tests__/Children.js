import {Children} from "../Children"
import React from 'react'
import {shallow} from 'enzyme';
describe("create SourcesList", () => {
  // todo test for error
  // todo test for loading 
  // todo test for level 1
  // todo test for selectArticles = article selected and viewing text
  it("render parent page", () =>{
    const setQuery = jest.fn()

    const filterChange = jest.fn()
    const clearSelect = jest.fn()
    const fetchSelect = jest.fn()
    const selectArticles= []
    const selectErrors= jest.fn()

    const fetchArticles = jest.fn()
    const fetchFullArticles = jest.fn()
    const setHomeSelections = jest.fn()
    const setPage = jest.fn()
    const query = {}

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
    //Home functions
    const showChildren = jest.fn()
    const wrapper = shallow(
      <Children
          setQuery={setQuery}
          query={query}

          filterChange={filterChange}
          parent_func={parent_func}
          level={0}
          child={child}
          child_func={child_func}
          parent_id = {-1}
          show_children={showChildren}

          selectArticles={selectArticles}
          selectErrors={selectErrors}
          fetchSelect={fetchSelect}
          clearSelect={clearSelect}

          parent={parent}
      />
    
    );
    expect(wrapper.exists()).toBe(true) 
    expect(filterChange.mock.calls.length).toBe(1)
    expect(wrapper.find('tbody').children().length).toBe(3)
  })
  it("render loading parent page", () =>{
    const setQuery = jest.fn()

    const filterChange = jest.fn()
    const clearSelect = jest.fn()
    const fetchSelect = jest.fn()
    const selectArticles= []
    const selectErrors= jest.fn()

    const fetchArticles = jest.fn()
    const fetchFullArticles = jest.fn()
    const setHomeSelections = jest.fn()
    const setPage = jest.fn()
    const query = {}

    const parent = {
      articlesList:[{id:1,
        title:"test",
        text:"test",
        upload_date:new Date(),
        source:{name:"test"}}],
      articlesLoading:true,
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
    //Home functions
    const showChildren = jest.fn()
    const wrapper = shallow(
      <Children
          setQuery={setQuery}
          query={query}

          filterChange={filterChange}
          parent_func={parent_func}
          level={0}
          child={child}
          child_func={child_func}
          parent_id = {-1}
          show_children={showChildren}

          selectArticles={selectArticles}
          selectErrors={selectErrors}
          fetchSelect={fetchSelect}
          clearSelect={clearSelect}

          parent={parent}
      />
    
    );
    expect(wrapper.exists()).toBe(true) 
    expect(filterChange.mock.calls.length).toBe(1)
    expect(wrapper.find('tbody').children().length).toBe(3)
  })


})

