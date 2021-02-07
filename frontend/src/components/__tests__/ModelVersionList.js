import ModelVersionList from '../ModelVersionList'
import React from 'react'
import { shallow, mount } from 'enzyme'
describe('create ModelVersionList', () => {
  it('renders', () => {
    const query = {}
    const setQuery = jest.fn()
    const modelList = [
      {
        id: 1,
        name: 'test'
      }
    ]
    const modelVersionList = [
      {
        id: 1,
        model: { name: 'test', id: 1 },
        version: 1,
        status: 'failed',
        metric_name: 'test',
        metric_value: 1,
        active: true
      }
    ]
    const modelVersionLoading = false
    const modelVersionErrors = {}
    const modelVersionTotalCount = 1
    const modelVersionNext = 'http://test'
    const modelVersionPrevious = 'http://prev'

    const filterChange = jest.fn()
    const fetchModelVersions = jest.fn()
    const setPage = jest.fn()
    const setActiveVersion = jest.fn()

    const wrapper = mount(
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
    // todo - change sort
    expect(filterChange.mock.calls.length).toBe(1)
    const refresh = wrapper.find('Button').at(0)
    refresh.simulate('click')
    expect(filterChange.mock.calls.length).toBe(2)
    const firstcheck = wrapper.find('input').first()
    firstcheck.simulate('change', { target: { dataset: { model: 1, id: 1 }, checked: true } })
    expect(setActiveVersion.mock.calls.length).toBe(1)

    // todo - error test seperate
    // todo - test click checkbox
  })
})
