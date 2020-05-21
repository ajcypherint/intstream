import Choice from "../Choice"
import React from 'react'
import {shallow} from 'enzyme';
describe("create Choice", () => {
  it("renders", () =>{
    const items = [1,2,3]
    const uniqueList=[{name:"test1",id:1},{name:"test2",id:1},{name:"test3",id:1}]
    const wrapper = shallow(<Choice
        name="test"
        idList={items}
        uniqueList={uniqueList}
        value={1}
        onChange={null}
        disabled={false}
        noAllValues={false}
    
      />);
    expect(wrapper.children().length).toBe(4)

  })
})

