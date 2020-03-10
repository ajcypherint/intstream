//
//state:
//  orderdir: str
//  sourceChosen: str
//  ordercol: str
//  page: int
//  startDate: date
//  endDate: date
//

import {PAGINATION, childString, dateString} from '../util/util'
export function  changesort(column_name, 
                            ASC, 
                            DESC, 
                            selections,
                            setHomeSelections,
                            level = 0,
                            parent = undefined,
  ){
  // column_name: str
  // ASC: str
  // DESC: str
  // selections: obj { startDate,endDate,sourceChosen}
  // setHomeSelections: func
  //
  let path = level === 0 ? 'filter' : 'childFilter'
  let fetch_string = ""
   if (selections.ordercol===column_name) {
      // column matches sort column opposite
      if(selections.orderdir===ASC){
        let newSelections = {
          ...selections,
          orderdir:DESC,
          page:1
        }
       setHomeSelections(newSelections,path, parent)
        }
      else{
        let newSelections = {
          ...selections,
          orderdir:ASC,
          page:1
        }
       setHomeSelections(newSelections, path, parent)
      }
    }
    else{
      //sort by this column ascending; first time sorting this column
      let newSelections = {
        ...selections,
        ordercol:column_name,
        orderdir:ASC,
        page:1
      }
      setHomeSelections(newSelections, path, parent) 

    }
  }
  

