import _ from 'lodash'

export function findEnumName (e, val) {
  return _.find(e, item => {
    return item.value === val
  })
}

export function findEnumIcon (e, val) {
  let it = _.find(e, item => {
    return item.value === val
  })
  return it ? it.icon : undefined
}

export function createQueryString (condiFields, cond) {
  let r = ''
  let obj = {}
  for (let i = 0; i < condiFields.length; i++) {
    if (cond.filters[i] !== 0) {
      obj[condiFields[i]] = cond.filters[i]
    }
  }
  r = 'q=' + JSON.stringify(obj) + '&'
  if (cond.search) {
    let s = cond.search.trim()
    if (s.length > 0) r = r + 's=' + s
  }
  return r
}
