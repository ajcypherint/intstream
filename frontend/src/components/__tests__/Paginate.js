import Paginate from "../Paginate"
import React from 'react'
import {shallow} from 'enzyme';

describe("create Choice", () => {
  it("renders", () => {
    let fetchitHandler = jest.fn()
    let fetchFullHandler = jest.fn()
    let setPage = jest.fn()
    const wrapper = shallow(Paginate(
      15,
      "next",
      "prev",
      fetchitHandler,
      fetchFullHandler,
      {page:1,sortCol:"test"},
      setPage,
      false
    ))
    expect(wrapper.find('PaginationLink').length).toBe(6)
  })
  it("render child", () => {
    let fetchitHandler = jest.fn()
    let fetchFullHandler = jest.fn()
    let setPage = jest.fn()
    const wrapper = shallow(Paginate(
      15,
      "next",
      "prev",
      fetchitHandler,
      fetchFullHandler,
      {page:1,sortCol:"test",child:{page:1}},
      setPage,
      true
    ))
    let nextPage = wrapper.find('PaginationLink').at(1)
    nextPage.simulate("click");
    expect(setPage.mock.calls.length).toBe(1)
    nextPage = wrapper.find('PaginationLink').at(4)
    nextPage.simulate("click");
    expect(setPage.mock.calls.length).toBe(2)
 
  })

})
