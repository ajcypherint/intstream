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
  fetch){
  // column_name: str
  // ASC: str
  // DESC: str
  //
    console.log("clicked")
   if (this.state.ordercol===column_name) {
      // column matches sort column opposite
      if( this.state.orderdir===ASC){
       this.setState({orderdir:DESC,page:1})
        //call desc sort
       fetch(dateString(DESC,
         column_name,
        this.state.sourceChosen,
        1,
        this.state.startDate,
      this.state.endDate))
        }
      else{
       this.setState({orderdir:ASC,page:1})
        //call asc sort
       fetch(
        dateString(ASC,
         column_name,
        this.state.sourceChosen,
        1,
        this.state.startDate,
      this.state.endDate))
      }
    }
    else{
      //sort by this column ascending; first time sorting this column
       this.setState({ordercol:column_name,orderdir:ASC,page:1}) 
        //call asc sort
       fetch(
         dateString(ASC,
             column_name,
            this.state.sourceChosen,
            1,
            this.state.startDate,
          this.state.endDate))
      }
  }
  

