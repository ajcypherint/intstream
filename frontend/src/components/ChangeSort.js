//
// state:
//  orderdir: str
//  sourceChosen: str
//  ordering: str
//  page: int
//  startDate: date
//  endDate: date
//

import { PAGINATION, childString, dateString } from '../util/util'
export function changesort (column_name,
  ASC,
  DESC,
  selections,
  setHomeSelections,
  setQuery,
  level = 0,
  parent = undefined
) {
  // column_name: str
  // ASC: str
  // DESC: str
  // selections: obj { startDate,endDate,sourceChosen}
  // setHomeSelections: func
  //
  if (selections.ordering === column_name) {
    // column matches sort column opposite
    const orderdir = selections.orderdir || ''
    if (orderdir === ASC) {
      const newSelections = {
        ...selections,
        orderdir: DESC,
        page: 1
      }
      setHomeSelections(newSelections, setQuery, parent)
    } else {
      const newSelections = {
        ...selections,
        orderdir: ASC,
        page: 1
      }
      setHomeSelections(newSelections, setQuery, parent)
    }
  } else {
    // sort by this column ascending; first time sorting this column
    const newSelections = {
      ...selections,
      ordering: column_name,
      orderdir: ASC,
      page: 1
    }
    setHomeSelections(newSelections, setQuery, parent)
  }
}
