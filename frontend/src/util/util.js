import _ from 'lodash'

export const NONE = '-Select-'
export const NONEVAL = ''

export const PAGINATION = 10
export const EDIT = 'Edit'
export const ADD = 'Add'

export const ALL = '---'
export const ASC = ''
export const DESC = '-'

export function getOpts (event) {
  const opts = []; let opt
  for (let i = 0, len = event.target.options.length; i < len; i++) {
    opt = event.target.options[i]
    if (opt.selected) {
      opts.push(opt.value)
    }
  }
  return opts
}
function ucFirst (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
export function getIdsModels (uniqueModels) {
  // uniqueModels: [{ id:int}]
  const idsModels = []
  for (let i = 0; i < uniqueModels.length; i++) {
    if (uniqueModels[i].id) {
      idsModels.push(uniqueModels[i].id.toString())
    }
  }
  return idsModels
}
export function getUniqueTrainListTF (filterArray) {
  const uniqueTFPre = _.uniqBy(filterArray, v => [v.target].join())
  const uniqueTFPre2 = uniqueTFPre.filter((object) => {
    if (object.target !== null) {
      return true
    } else {
      return false
    }
  }) // need to also filter out target=true, mlmodel_active=true
  const uniqueModels = []
  for (let i = 0; i < uniqueTFPre2.length; i++) {
    const newObj = {
      id: uniqueTFPre2[i].target,
      name: ucFirst(uniqueTFPre2[i].target.toString())
    }
    uniqueModels.push(newObj)
  }

  return uniqueModels
}

export function getUniqueModels (filterArray) {
  const uniqueModelsPre = _.uniqBy(filterArray, v => [v.mlmodel_id, v.mlmodel_active, v.target].join())
  const uniqueModelsPre2 = uniqueModelsPre.filter((object) => {
    if (object.mlmodel !== null &&
      object.mlmodel_active === true &&
      object.target === true) {
      return true
    } else {
      return false
    }
  }) // need to also filter out target=true, mlmodel_active=true
  const uniqueModels = []
  for (let i = 0; i < uniqueModelsPre2.length; i++) {
    const newObj = {
      id: uniqueModelsPre2[i].mlmodel_id,
      name: uniqueModelsPre2[i].mlmodel
    }
    uniqueModels.push(newObj)
  }

  return uniqueModels
}

// todo(aj) add model; filter target=True
// model is parameter
// &prediction__mlmodel=
// hard code prediction true **if model != ""
// &prediction__target=true

export function dateString (
  orderdir,
  ordercol,
  sourceChosen,
  page,
  start,
  end,
  threshold
) {
  // :param orderdir: str
  // :param ordercol: str
  // :param sourceChosen: str
  // :param page: int
  // :param start: date
  // :param end: date

  return 'ordering=' + orderdir +
        ordercol +
        '&source=' + sourceChosen +
        '&page=' + page +
        '&start_upload_date=' + start.toISOString() +
    '&end_upload_date=' + end.toISOString() +
    (typeof threshold !== 'undefined' ? '&threshold=' + threshold : '')
}

export function addDays (date, days) {
  const copy = new Date(Number(date))
  copy.setDate(date.getDate() + days)
  return copy
}

export function subDays (date, days) {
  const copy = new Date(Number(date))
  copy.setDate(date.getDate() - days)
  return copy
}
