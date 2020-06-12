import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

Vue.use(Router);

let routes = [
    {path: '*', name: '*', redirect: '/404'},
    {path: '/404', name: '404', component: () => import('@/views/404')},
    {
        path: '/',
        name: '/',
        redirect: '/login',
        component: () => import('@/views/user/login/login'),
        meta: {keepAlive: false,requireLogin:false}
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
                resolve({ x: 0, y: to.meta.savedPosition ||0})
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
    let isNeedLogin=true;
    if(to.meta.requireLogin!=null&&to.meta.requireLogin===false){
        isNeedLogin=false;
    }
    if(isNeedLogin){//需要拦截
       if(store.getters.token!=null&& store.getters.id){
           next();
       }else{
           next({
               name: '/'
           });
       }
    }else{
        next();
    }
});

export function resetRouter() {
    myRouter.replace('/login');
}

export default myRouter
