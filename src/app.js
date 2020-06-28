import createVueApp from '../finelets/createVueApp'

createVueApp({
    app: {
        name: 'Cross',
        loginPageTitle: 'JSMetta Cross',
        roles: [
            { name: '设计人员', value: 'DEV' },
            { name: '检测员', value: 'OPR' },
            { name: '采购员', value: 'PURCHASER' },
            { name: '执行总监', value: 'CEO' }
          ]
    }
})