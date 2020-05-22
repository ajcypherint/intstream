import Train from "../Train"
import React from 'react'
import {shallow, mount, render} from 'enzyme';
describe("create ", () => {
  it("render ", () =>{
    let articlesList = [{
      id:1,
      title:"test",
      clean_text:"text"
    }]
    let match = {
      params:{id:1}
    }
    let history ={
      goBack:jest.fn()
    }
    let fetchArticles = jest.fn()
    let wrapper = shallow(
      <Train
        articleList={articlesList}
        match={match}
        history={history}
        fetchArticles={fetchArticles}

      />
    )
    expect(wrapper.children().length).toBe(2)
    expect(fetchArticles.mock.calls.length).toBe(1)
    //todo add test for button and inputs
  })



})
 
