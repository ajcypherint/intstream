export const PAGINATION=10
export const EDIT ="Edit"
export const ADD = "Add"

export const ALL = "---"
export const ASC = ''
export const DESC = '-'


export function dateString(
  orderdir,
  ordercol,
  sourceChosen,
  page,
  start,
  end
){
  // :param orderdir: str
  // :param ordercol: str
  // :param sourceChosen: str
  // :param page: int
  // :param start: date
  // :param end: date
    start.setHours(0,0,0,0);

    end.setHours(23,59,59,999);
  
   return "ordering=" + orderdir+
        ordercol +
        "&source=" + sourceChosen +
        "&page=" + page +
        "&start_upload_date=" + start.toISOString() +
        "&end_upload_date=" + end.toISOString()


}

export function addDays(date, days) {
  const copy = new Date(Number(date))
  copy.setDate(date.getDate() + days)
  return copy
}

export function subDays(date, days) {
  const copy = new Date(Number(date))
  copy.setDate(date.getDate() - days)
  return copy
}


