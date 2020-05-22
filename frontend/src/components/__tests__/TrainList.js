import Train from "../TrainList"
import React from 'react'
import {shallow, mount, render} from 'enzyme';
describe("create ", () => {
  it("render ", () =>{

  let query = {}
  let setQuery = jest.fn()

  let sourcesList = [
    {
      id:1,
      name:"test",
      target:true
    }]
  let modelsList = [
    {
      id:1,
      name:"test",
    }]
  let articlesList = [{
      id:1,
      title:"test",
      clean_text:"text",
      source:{name:"test"}
    }]
   
  let articlesLoading = false
  let articlesErrors = {}
  let articlesTotalCount = 1
  let articleNext = "link"
  let articlePrevious = "link"
  let articleuri  = "link"
  let selectArticles = [1]
  let selectErrors = {}
  let classif = {
      1:true
    }
  let classifErrors = {}
  let classifCounts = 1
  let filterChange = jest.fn()
  let fetchAllSources = jest.fn()
  let fetchAllMLModels = jest.fn()
  let fetchArticlesFullUri = jest.fn()
  let fetchArticles = jest.fn()
  let clearArticles = jest.fn()
  let clear = jest.fn()
  let fetchSelect = jest.fn()
  let clearSelect = jest.fn()
  let fetchArticlesAndClassif = jest.fn()
  let deleteClassification = jest.fn()
  let setClassif = jest.fn()
  let fetchClassifCounts = jest.fn()
  let clearClassif = jest.fn()

    let wrapper = shallow(
      <Train
  query={query}
  setQuery={setQuery}
  sourcesList={sourcesList}
  modelsList={modelsList}
  articlesList={articlesList}
  articlesLoading={articlesLoading}
  articlesErrors={articlesErrors}
  articlesTotalCount={articlesTotalCount}
  articleNext={articleNext}
  articlePrevious={articlePrevious}
  articleuri={articleuri}
  selectArticles={selectArticles}
  selectErrors={selectErrors}
  classif={classif}
  classifErrors={classifErrors}
  classifCounts={classifCounts}
  filterChange={filterChange}
  fetchAllSources={fetchAllSources}
  fetchAllMLModels={fetchAllMLModels}
  fetchArticlesFullUri={fetchArticlesFullUri}
  fetchArticles={fetchArticles}
  clearArticles={clearArticles}
  clear={clear}
  fetchSelect={fetchSelect}
  clearSelect={clearSelect}
  fetchArticlesAndClassif={fetchArticlesAndClassif}
  deleteClassification={deleteClassification}
  setClassif={setClassif}
  fetchClassifCounts={fetchClassifCounts}
  clearClassif={clearClassif}

      />
    )
    expect(wrapper.children().length).toBe(4)
    expect(fetchAllMLModels.mock.calls.length).toBe(1)
    expect(clearClassif.mock.calls.length).toBe(1)
    expect(setQuery.mock.calls.length).toBe(1)
    //todo add test for button and inputs
  })



})
 
