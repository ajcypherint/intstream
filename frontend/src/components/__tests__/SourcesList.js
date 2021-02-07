import SourcesList from '../SourcesList'
import React from 'react'
import { shallow } from 'enzyme'
describe('create SourcesList', () => {
  it('renders', () => {
    const fetchSources = () => {
      const sources = [
        {
          id: 1
        }]
      return sources
    }
    const clearSources = jest.fn()
    const fetchfull = jest.fn()
    const setQuery = jest.fn()
    const wrapper = shallow(
      <SourcesList
    sourcesList={[{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]}
    sourcesLoading={false}
    sourcesErrors={null}
    fields={['test', 'test2']}
    heading={'test'}
    totalCount={2}
    edituri={'/test'}
    next={'/api/next'}
    previous={'/api/previous'}
    addUri={'/add'}
    query={{}}

    fetchSources={fetchSources}
    fetchSourcesFullUri={fetchfull}
    clearSources={clearSources}
    setQuery={setQuery}

      />

    )
    expect(setQuery.mock.calls.length).toBe(1)
    let header = wrapper.find('th').at(0)
    header.simulate('click')
    expect(setQuery.mock.calls.length).toBe(2)
    header = wrapper.find('th').at(1)
    header.simulate('click')
    expect(setQuery.mock.calls.length).toBe(3)
  })
  it('renders loading', () => {
    const fetchSources = () => {
      const sources = [
        {
          id: 1
        }]
      return sources
    }
    const clearSources = jest.fn()
    const fetchfull = jest.fn()
    const setQuery = jest.fn()
    const wrapper = shallow(
      <SourcesList
    sourcesList={[{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]}
    sourcesLoading={true}
    sourcesErrors={null}
    fields={['test', 'test2']}
    heading={'test'}
    totalCount={2}
    edituri={'/test'}
    next={'/api/next'}
    previous={'/api/previous'}
    addUri={'/add'}
    query={{}}

    fetchSources={fetchSources}
    fetchSourcesFullUri={fetchfull}
    clearSources={clearSources}
    setQuery={setQuery}

      />

    )
    const body = wrapper.find('tbody')
    expect(body.children().length).toBe(1)
    expect(setQuery.mock.calls.length).toBe(1)
  })
})
