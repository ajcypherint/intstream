export const PAGINATION=10

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
   return "ordering=" + orderdir+
        ordercol +
        "&source=" + sourceChosen +
        "&page=" + page +
        "&start_upload_date=" + start.toISOString().split('T')[0] +
        "&end_upload_date=" + end.toISOString().split('T')[0]

}
