//
//state:
//  orderdir: str
//  sourceChosen: str
//  ordercol: str
//  page: int
//  startDate: date
//  endDate: date
//

import {PAGINATION, dateString} from '../util/util'

export function  changesort(column_name, 
                            ASC, 
                            DESC, 
                            fetch,
                            selections,
                            setHomeSelections
  ){
  // column_name: str
  // ASC: str
  // DESC: str
  // selections: obj { startDate,endDate,sourceChosen}
  // setHomeSelections: func
  //
   if (selections.ordercol===column_name) {
      // column matches sort column opposite
      if(selections.orderdir===ASC){
       setHomeSelections({orderdir:DESC,page:1})
        //call desc sort
       fetch(dateString(DESC,
         column_name,
        selections.sourceChosen,
        1,
        selections.startDate,
        selections.endDate))
        }
      else{
       setHomeSelections({orderdir:ASC,page:1})
        //call asc sort
       fetch(
        dateString(ASC,
         column_name,
         selections.sourceChosen,
         1,
         selections.startDate,
         selections.endDate))
      }
    }
    else{
      //sort by this column ascending; first time sorting this column
       setHomeSelections({ordercol:column_name,orderdir:ASC,page:1}) 
        //call asc sort
       fetch(
         dateString(ASC,
             column_name,
            selections.sourceChosen,
            1,
            selections.startDate,
            selections.endDate))
         }
  }
  

