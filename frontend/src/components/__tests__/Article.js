import Article from '../Article'
import React from 'react'
import { shallow } from 'enzyme'
describe('create Article', () => {
  it('renders', () => {
    const fetchArticles = jest.fn()
    const history = { goback: jest.fn() }
    const match = { params: { id: 1 } }
    const wrapper = shallow(
      <Article
        match={match}
        history={history}
        fetchArticles={fetchArticles}
        articlesList={[
          {
            cleantext: 'test',
            title: 'test'
          }
        ]}
      />
    )
    expect(fetchArticles.mock.calls.length).toBe(1)
  })
})
