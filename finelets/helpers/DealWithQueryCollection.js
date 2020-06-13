import _ from 'lodash'
import {$get} from '../plugins/fetch'

function dealWithLinkages (linkages) {
  let links = {}
  _.forEach(linkages, item => {
    links[item.rel] = item.href
  })
  return links
}

function dealWithCollectionItem (type, data) {
  const entity = {
    data: data[type]
  }
  const links = dealWithLinkages(data.links)
  entity.links = {
    self: data.href,
    ...links
  }
  return entity
}

export async function dealWithCollection (data, type, refs) {
  const result = []
  for (let i = 0; i < data.collection.items.length; i++) {
    let entity = await $get(data.collection.items[i].link.href)
    const obj = await dealWithEntity(entity, type, refs)
    result.push(obj)
  }
  return result
}

export async function dealWithEntity (entity, name, refs) {
  let result = dealWithCollectionItem(name, entity)
  const finalRefs = refs || {}
  for (var key in finalRefs) {
    const flds = _.isArray(finalRefs[key]) ? finalRefs[key] : [finalRefs[key]]
    for (let i = 0; i < flds.length; i++) {
      const fld = flds[i]
      if (entity[name][fld]) {
        let obj = await $get(entity[name][fld])
        obj = dealWithCollectionItem(key, obj)
        result.data[fld] = obj.data.id
        result[fld] = obj
      }
    }
  }
  return result
}

export async function searchCollection (getters, rel, condi, type, refs) {
  const entry = getters.entry
  let url = entry[rel]
  if (condi) url = `${url}?${condi}`
  const coll = await $get(url)
  let data = await dealWithCollection(coll, type, refs)
  return data
}

const utils = {
  searchCollection,
  dealWithEntity,
  dealWithLinkages
}
export default utils
