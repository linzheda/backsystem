import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
NProgress.configure({showSpinner: false}) // NProgress Configuration
Vue.use(Router);

let routes = [

    {
        path: '/',
        name: '/',
        redirect: '/login',
        component: () => import('@/views/user/login/login'),
        meta: {keepAlive: false, requireLogin: false}
    },
];
const routerContext = require.context('./', true, /\.js$/);
routerContext.keys().forEach(route => {
    // 如果是根目录的 index.js 、不处理
    if (route.startsWith('./index')) {
        return
    }
    const routerModule = routerContext(route);
    /**
     * 兼容 import export 和 require module.export 两种规范
     */
    routes = routes.concat(routerModule.default || routerModule)
});


//获取滚动条的位置
function getScrollTop() {
    let scroll_top = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
        scroll_top = document.documentElement.scrollTop;
    } else if (document.body) {
        scroll_top = document.body.scrollTop;
    }
    return scroll_top;
}

//滚动条
const scrollBehavior = function (to, from, savedPosition) {
    if (savedPosition) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(savedPosition);
            }, 300)
        });
    } else {
        if (from.meta.keepAlive) {
            from.meta.savedPosition = getScrollTop();
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({x: 0, y: to.meta.savedPosition || 0})
            }, 300)
        });
    }
};
const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: scrollBehavior,
    routes
});

const myRouter = createRouter();
const history = window.sessionStorage;
history.clear();

myRouter.beforeEach((to, from, next) => {
    NProgress.start();//页面加载进度条
    let isNeedLogin = true;
    if (to.meta.requireLogin != null && to.meta.requireLogin === false) {
        isNeedLogin = false;
    }
    if (isNeedLogin) {//需要拦截
        if (store.getters.token != null && store.getters.id != null) {
            if (store.getters.menus == null || store.getters.menus.length == 0) {
                store.dispatch('getMenu').then(() => {
                    let name = to.path.substring(to.path.lastIndexOf('/') + 1);
                    let view = {
                        path: "/dashboard/index",
                        name: "dashboard",
                        meta: {
                            affix: true,
                            icon: "home",
                            keepAlive: true,
                            title: "首页",
                        }
                    };
                    store.dispatch('addTagsView', view)
                    next({name: name});
                });
            } else {
                next();
            }
        } else {
            next({
                name: '/'
            });
        }
    } else {
        next();
    }
});

myRouter.afterEach(() => {
    // finish progress bar
    NProgress.done()
})

export function resetRouter() {
    const newRouter = createRouter()
    myRouter.matcher = newRouter.matcher // reset router
}

export default myRouter
