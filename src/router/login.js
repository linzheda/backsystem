export default [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/user/login/login'),
        meta: {keepAlive: false, requireLogin: false}
    },
    {
        path: '/test',
        name: 'test',
        component: () => import('@/views/test/test'),
        meta: {keepAlive: false, requireLogin: false}
    },
]
