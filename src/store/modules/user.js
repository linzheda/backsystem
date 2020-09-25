import {post} from '@/plugins/http';
import Layout from '@/views/layout'
import router, { resetRouter } from '@/router'
const user = {
    state: {
        id: '',
        token: '',
        name: '',
        menus:[],
    },
    mutations: {
        SET_ID:(state,id)=>{
            state.id=id
            localStorage.setItem('id', id)
        },
        SET_TOKEN: (state, token) => {
            state.token = token
            localStorage.setItem('token', token)
        },
        SET_NAME: (state, name) => {
            state.name = name
            localStorage.setItem('name', name)
        },
        SET_MENUS: (state, menus) => {
            state.menus = menus
        }
    },
    actions: {
        Login({commit}, userinfo) {//登陆
            return new Promise((resolve, reject) => {
                post('user/user/login', userinfo).then(data => {
                    commit('SET_ID', data.data.id);
                    commit('SET_NAME', data.data.name);
                    commit('SET_TOKEN', data.data.token);
                    resolve(data);
                }).catch(error => {
                    reject(error);
                });
            });
        },
        updateToken({commit}, token){//更新token
            commit('SET_TOKEN', token);
        },
        loginOut({commit,state},type=0) {
            return new Promise((resolve) => {
                if(type==1){//说明是自己主动登出
                    let param={
                        id: state.id||localStorage.getItem("id"),
                    };
                    post('user/user/loginOut', param).then(res=>{
                        console.log(res)
                        commit('SET_ID','');
                        commit('SET_NAME','');
                        commit('SET_TOKEN','');
                        commit('SET_MENUS','');
                        localStorage.clear();
                        resetRouter();
                        resolve();
                    });
                }else{
                    commit('SET_ID','');
                    commit('SET_NAME','');
                    commit('SET_TOKEN','');
                    commit('SET_MENUS','');
                    localStorage.clear();
                    resetRouter();
                    resolve();
                }

            });
        },
        getMenu({commit,state}){//获取权限菜单
            return new Promise((resolve, reject) => {
                let param={
                    userId: state.id||localStorage.getItem("id"),
                    isn: '0.-1',
                    pid: -1
                };
                post('user/resources/getResourcesByUserId', param).then(data => {
                    let arr = [{
                        id:null,
                        path: '/dashboard',
                        component: Layout,
                        redirect: '/dashboard/index',
                        meta:{title:'首页',icon:'home'},
                        children: [
                            {
                                path: 'index',
                                component: () => import('@/views/dashboard/dashboard'),
                                name: 'dashboard',
                                meta: { title: '首页',icon:'home',keepAlive: true,affix: true }
                            }
                        ]
                    }];
                    let  arr2=[
                        {path: '/redirect', component: Layout, hidden: true, children: [{path: '/redirect/:path*', component: () => import('@/views/redirect/index')}]},
                        {path: '/404', name: '404', component: () => import('@/views/404'), meta: { title: '404',icon:'404' }, hidden: true},
                        {path: '*', name: '*', redirect: '/404', meta: { title: '404',icon:'404' },hidden: true},
                    ];
                    let result= arr.concat(filterAsyncRouter(data.data));
                    commit('SET_MENUS', result);
                    router.addRoutes(result);
                    router.addRoutes(arr2);
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            });
        }
    }
};
// 遍历后台传来的路由字符串，转换为组件对象
// eslint-disable-next-line no-unused-vars
function filterAsyncRouter(asyncRouterMap) { //遍历后台传来的路由字符串，转换为组件对象
    const accessedRouters = asyncRouterMap.filter(route => {
        if (route.component) {
           if (route.component === 'Layout') {//Layout组件特殊处理
                route.component = Layout
            } else {
                route.component = loadView(route.component)
            }
        }
        if (route.children && route.children.length) {
            route.children = filterAsyncRouter(route.children)
        }
        return true
    });
    return accessedRouters
}
function loadView(view) {
    // 路由懒加载
    return () => import('@/views/' + view );
}

export default user
