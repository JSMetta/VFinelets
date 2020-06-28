const roles = [
  { name: '设计人员', value: 'DEV' },
  { name: '检测员', value: 'OPR' },
  { name: '采购员', value: 'PURCHASER' },
  { name: '执行总监', value: 'CEO' }
]

const part = [
  {name: '料品', value: 1},
  {name: '资产', value: 2},
  {name: '耗材', value: 3},
  {name: '器具', value: 4}
]

const supplier = [
  {name: '厂家', value: 1},
  {name: '电商', value: 2},
  {name: '实体店', value: 3}
]

const purchaseState = [
  {name: '草稿', value: 'Draft', icon: 'keyboard'},
  {name: '待审', value: 'Review', icon: 'tasklist'},
  {name: '未核准', value: 'Unapproved', icon: 'bug'},
  {name: '执行', value: 'Open', icon: 'pulse'},
  {name: '结案', value: 'Closed', icon: 'star'},
  {name: '中止', value: 'Canceled', icon: 'x'}
]

const enums = {
  roles, part, supplier, purchaseState
}

export default enums
