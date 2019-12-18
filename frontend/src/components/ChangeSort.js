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
                            fetch,
                            selections,
                            setHomeSelections,
                            level = 0,
                            parent = undefined
  ){
  // column_name: str
  // ASC: str
  // DESC: str
  // selections: obj { startDate,endDate,sourceChosen}
  // setHomeSelections: func
  //
  let fetch_string = ""
   if (selections.ordercol===column_name) {
      // column matches sort column opposite
      if(selections.orderdir===ASC){
       setHomeSelections({orderdir:DESC,page:1})
        //call desc sort
       fetch_string = level === 0 ? dateString(DESC,
                                          column_name,
                                          selections.sourceChosen,
                                          1,
                                          selections.startDate,
                                          selections.endDate) : childString(DESC,
                                                                            column_name,
                                                                            1,
                                                                            parent)
       fetch(fetch_string)
       level === 0 ? fetch(fetch_string) : fetch(parent,fetch_string)
        }
      else{
       setHomeSelections({orderdir:ASC,page:1})
        //call asc sort
        fetch_string = level === 0 ? dateString(ASC,
                                             column_name,
                                             selections.sourceChosen,
                                             1,
                                             selections.startDate,
                                             selections.endDate) : childString(ASC,
                                                                               column_name,
                                                                               1,
                                                                               parent)
                                            
      }
    }
    else{
      //sort by this column ascending; first time sorting this column
      setHomeSelections({ordercol:column_name,orderdir:ASC,page:1}) 
      fetch_string = level === 0 ? dateString(ASC,
                                                  column_name,
                                                  selections.sourceChosen,
                                                  1,
                                                  selections.startDate,
                                                  selections.endDate) : childString(ASC,
                                                                                    column_name,
                                                                                    1,
                                                                                    parent)
 
      //call asc sort
         }
   level === 0 ? fetch(fetch_string) : fetch(parent,fetch_string)
  }
  

