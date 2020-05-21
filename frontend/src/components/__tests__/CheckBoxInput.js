import CheckBox from "../CheckBoxInput"
import React from 'react'
import {shallow} from 'enzyme';
describe("create checkbox", () => {
  it("renders", () =>{
    const fetchArticles = jest.fn()
    const wrapper = shallow(
      <CheckBox
        name="test"
        label="test"
        type="checkbox"
      />
    );
    expect(wrapper.children().length).toBe(1)

  })
  it("renders", () =>{
    const fetchArticles = jest.fn()
    const wrapper = shallow(
      <CheckBox
        name="test"
        label="test"
        type="textarea"
      />
    );
    expect(wrapper.children().length).toBe(1)

  })

})

