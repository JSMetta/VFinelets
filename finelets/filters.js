import moment from 'moment'
moment.locale('zh')

export function date (value) {
  return moment(value).format('YYYY-MM-D LT')
}

export function onlyDate (value) {
  return moment(value).format('YYYY-MM-D')
}

export function onlyTime (value) {
  let now = moment(value)
  let hour = now.get('hour')
  let minute = now.get('minute')
  let second = now.get('second')
  let millisecond = now.get('millisecond')
  return `${hour}:${minute}:${second}:${millisecond}`
}

export function relativeDate (value) {
  return moment(value).fromNow()
}

export function LLDate (value) {
  return moment(value).format('LL')
}
