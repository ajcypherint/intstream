import React from 'react'
import {changesort} from '../ChangeSort'
import {shallow} from 'enzyme';
describe("create Choice", () => {
  let ASC = "ASC"
  let DESC = "DESC"
 const setQuery = jest.fn()
  it("sort same col desc", () =>{
   let selections = { orderdir:ASC,
                       page:1,
                       ordering:"column"
                     }
 
    let resSetHome = {}
    const setHomeSelections = (newSelections, setQuery, parent) =>{
      resSetHome = {newSelections:newSelections, setQuery:setQuery, parent:parent}
    }
    changesort("column", 
                            "ASC", 
                            "DESC", 
                            selections,
                            setHomeSelections,
                            setQuery,
                            0
                            )
    expect(resSetHome).toMatchObject(
      {
        newSelections:{orderdir:DESC, page:1, ordering:"column"},
        setQuery:setQuery,
        parent:undefined,
      }
    )
  })
  it("sort same col asc", () =>{
   let selections = { orderdir:DESC,
                       page:1,
                       ordering:"column"
                     }
 
    let resSetHome = {}
    const setHomeSelections = (newSelections, setQuery, parent) =>{
      resSetHome = {newSelections:newSelections, setQuery:setQuery, parent:parent}
    }
    changesort("column", 
                            "ASC", 
                            "DESC", 
                            selections,
                            setHomeSelections,
                            setQuery,
                            0
                            )
    expect(resSetHome).toMatchObject(
      {
        newSelections:{orderdir:ASC, page:1, ordering:"column"},
        setQuery:setQuery,
        parent:undefined,
      }
    )
  })
 
  it("sort diff column", () =>{
   let selections = { orderdir:DESC,
                       page:1,
                       ordering:"column"
                     }
 
    let resSetHome = {}
    const setHomeSelections = (newSelections, setQuery, parent) =>{
      resSetHome = {newSelections:newSelections, setQuery:setQuery, parent:parent}
    }
    const setQuery = jest.fn()
    const newcol = "diffcol"
    changesort(newcol, 
                            "ASC", 
                            "DESC", 
                            selections,
                            setHomeSelections,
                            setQuery,
                            0
                            )
    expect(resSetHome).toMatchObject(
      {
        newSelections:{orderdir:ASC, page:1, ordering:newcol},
        setQuery:setQuery,
        parent:undefined,
      }
    )
  })


})
 
