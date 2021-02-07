import Train from '../TrainList'
import React from 'react'
import { shallow, mount, render } from 'enzyme'
describe('create ', () => {
  it('render ', () => {
    const query = {}
    const setQuery = jest.fn()

    const sourcesList = [
      {
        id: 1,
        name: 'test',
        target: true
      }]
    const modelsList = [
      {
        id: 1,
        name: 'test'
      }]
    const articlesList = [{
      id: 1,
      title: 'test',
      clean_text: 'text',
      source: { name: 'test' }
    }]

    const articlesLoading = false
    const articlesErrors = {}
    const articlesTotalCount = 1
    const articleNext = 'link'
    const articlePrevious = 'link'
    const articleuri = 'link'
    const selectArticles = [1]
    const selectErrors = {}
    const classif = {
      1: true
    }
    const classifErrors = {}
    const classifCounts = 1
    const filterChange = jest.fn()
    const fetchAllSources = jest.fn()
    const fetchAllMLModels = jest.fn()
    const fetchArticlesFullUri = jest.fn()
    const fetchArticles = jest.fn()
    const clearArticles = jest.fn()
    const clear = jest.fn()
    const fetchSelect = jest.fn()
    const clearSelect = jest.fn()
    const fetchArticlesAndClassif = jest.fn()
    const deleteClassification = jest.fn()
    const setClassif = jest.fn()
    const fetchClassifCounts = jest.fn()
    const clearClassif = jest.fn()

    const wrapper = shallow(
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
    // todo add test for button and inputs
  })
})
