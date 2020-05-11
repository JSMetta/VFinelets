import constDefs from './ConstantsDef'

export default (starts) => {
    const startPages = {...starts}
    startPages[constDefs.ROLE_ADMIN] = constDefs.PAGE_NAME_ADMIN
    return startPages
}
