import createVueApp from '../finelets/createVueApp'

createVueApp({
    app: {
        name: 'Rockstar',
        loginPageTitle: 'JSMetta RockStar',
        roles: [
            { name: '设计人员', value: 'DEV' },
            { name: '检测员', value: 'OPR' }
          ]
    }
})