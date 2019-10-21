//
//state:
//  ordercol: str
//  orderdir: str
//  page: int
//

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
       this.setState({orderdir:DESC})
       fetch(
            "ordering="+DESC+column_name+"&page="+this.state.page)
        //call desc sort
        }
      else{
       this.setState({orderdir:ASC})
       fetch(
            "ordering="+ASC+column_name+"&page="+this.state.page)
        //call asc sort
      }
    }
    else{
      //sort by this column ascending; first time sorting this column
       this.setState({ordercol:column_name,orderdir:ASC}) 
       fetch(
            "ordering="+ASC+column_name+"&page="+this.state.page)
        //call asc sort
      }
  }
  

