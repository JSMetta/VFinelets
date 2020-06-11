import createVueApp from '../finelets/createVueApp'

createVueApp({
    app: {
        name: 'Textrade',
        loginPageTitle: 'Hotex Textrade',
        roles: [
            { name: '业务员', value: 'BIZ' }
          ]
    }
})