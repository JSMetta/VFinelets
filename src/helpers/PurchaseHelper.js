import {$get} from '../../finelets/plugins/fetch'
import {dealWithCollection} from '../../finelets/helpers/DealWithQueryCollection.js'

const refs = {
  User: 'actor'
}

export async function getPoTransactions (url) {
  const coll = await $get(url)
  let data = await dealWithCollection(coll, 'PoTransaction', refs)
  return data
}

export function poProgress (po) {
  let progress = 'width:' + (po.qty - po.left) * 100 / po.qty + '%'
  let color = progress < 20 ? 'bg-danger' : 'bg-success'
  return {
    progress,
    color
  }
}

const utils = {
  getPoTransactions,
  poProgress
}
export default utils
