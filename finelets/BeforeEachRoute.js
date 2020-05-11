import constDefs from './ConstantsDef'
import mergeStartPageOfRoles from './MergeStartPageOfRoles'


const __create = ({
    isSignIn,
    getRole,
    startPage
}) => {
    const __beforeEach = (to, from, next) => {
        // 尚未登录时，只能去public或guest页面，对任何访问其它页面的企图，均重定向到login页面(guest)
        if (!isSignIn() && !to.meta.public && !to.meta.guest) {
            next({
                name: constDefs.PAGE_NAME_LOGIN,
                params: {
                    wantedRoute: to.fullPath
                }
            })
            return
        }

        // 登录后
        if (isSignIn()) {
            // 拒绝转到guest页面, 如login页面
            if (to.meta.guest) return

            // 拒绝转到与角色不相符的页面：
            const role = getRole()
            if (!to.meta.public && !to.meta.guest && to.meta.role !== role) {
                // 如果来自与角色相符的页面，则直接拒绝，保持原页面不变；
                if (from.meta.role === role) return

                // 否则，转到角色相应的起始页面
                const toPage = startPage()
                next({
                    name: toPage
                })
            }
        }
        next()
    }
    return __beforeEach
}

const __createBeforeEachRoute = (store, rolesStartPage) => {
    const startPages = mergeStartPageOfRoles(rolesStartPage)

    const helpers = {
        isSignIn: () => {
            return store.getters.user
        },
        getRole: () => {
            const user = store.getters.user
            if (!user) return undefined
            if (user.isAdmin) return constDefs.ROLE_ADMIN
            return user.roles
        },
        startPage: () => {
            const r = helpers.getRole()
            return startPages[r]
        }
    }
    return __create(helpers)
}

export default __createBeforeEachRoute