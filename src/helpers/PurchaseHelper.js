export function poProgress (po) {
  let progress = 'width:' + (po.qty - po.left) * 100 / po.qty + '%'
  let color = progress < 20 ? 'bg-danger' : 'bg-success'
  return {
    progress,
    color
  }
}

const utils = {
  poProgress
}
export default utils
