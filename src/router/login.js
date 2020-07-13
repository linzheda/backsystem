export default [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/user/login/login'),
        meta: {keepAlive: false, requireLogin: false}
    },
]
