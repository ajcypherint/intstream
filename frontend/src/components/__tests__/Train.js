import Train from '../Train'
import React from 'react'
import { shallow, mount, render } from 'enzyme'
describe('create ', () => {
  it('render ', () => {
    const articlesList = [{
      id: 1,
      title: 'test',
      clean_text: 'text'
    }]
    const match = {
      params: { id: 1 }
    }
    const history = {
      goBack: jest.fn()
    }
    const fetchArticles = jest.fn()
    const wrapper = shallow(
      <Train
        articleList={articlesList}
        match={match}
        history={history}
        fetchArticles={fetchArticles}

      />
    )
    expect(wrapper.children().length).toBe(2)
    expect(fetchArticles.mock.calls.length).toBe(1)
    // todo add test for button and inputs
  })
})
