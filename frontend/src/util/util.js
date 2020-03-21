import _ from 'lodash';
export const PAGINATION=10
export const EDIT ="Edit"
export const ADD = "Add"

export const ALL = "---"
export const ASC = ''
export const DESC = '-'

function ucFirst(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getUniqueTrainListTF(filterArray){
  let uniqueTFPre= _.uniqBy(filterArray,v => [v.target].join())
  let uniqueTFPre2 = uniqueTFPre.filter((object)=>{ 
    if (object.target!==null )
      {
      return true
    } else {
      return false
    }
    }) // need to also filter out target=true, mlmodel_active=true
  let uniqueModels = []
  for( let i=0; i<uniqueTFPre2.length;i++){
    let newObj = {
      id:uniqueTFPre2[i].target,
      name:ucFirst(uniqueTFPre2[i].target.toString())
    }
    uniqueModels.push(newObj)
  }

  return uniqueModels

}

export function getUniqueModels(filterArray){
  let uniqueModelsPre= _.uniqBy(filterArray,v => [v.mlmodel_id, v.mlmodel_active,v.target].join())
  let uniqueModelsPre2 = uniqueModelsPre.filter((object)=>{ 
    if (object.mlmodel!==null && 
      object.mlmodel_active===true &&
      object.target===true){
      return true
    } else {
      return false
    }
    }) // need to also filter out target=true, mlmodel_active=true
  let uniqueModels = []
  for( let i=0; i<uniqueModelsPre2.length;i++){
    let newObj = {
      id:uniqueModelsPre2[i].mlmodel_id,
      name:uniqueModelsPre2[i].mlmodel
    }
    uniqueModels.push(newObj)
  }

  return uniqueModels
}

//todo(aj) add model; filter target=True
//model is parameter
//&prediction__mlmodel= 
//hard code prediction true **if model != ""
//&prediction__target=true

export function dateString(
  orderdir,
  ordercol,
  sourceChosen,
  page,
  start,
  end,
  threshold
){
  // :param orderdir: str
  // :param ordercol: str
  // :param sourceChosen: str
  // :param page: int
  // :param start: date
  // :param end: date
  
   return "ordering=" + orderdir +
        ordercol +
        "&source=" + sourceChosen +
        "&page=" + page +
        "&start_upload_date=" + start.toISOString() +
    "&end_upload_date=" + end.toISOString() +
    (threshold ? "&threshold=" + threshold : "")


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


