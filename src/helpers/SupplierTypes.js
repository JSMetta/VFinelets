import _ from 'lodash'
import enumsTypes from './Enums'

export function convert (type) {
  const p = _.find(enumsTypes.supplier, item => {
    return item.value === type
  })
  return p.name
}
export default convert
