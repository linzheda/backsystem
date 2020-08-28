import {post} from '@/plugins/http';
import Layout from '@/views/layout'

const user = {
    state: {
        id: '',
        token: '',
        name: '',
        roles: [],
        menus:[],
    },
    mutations: {
        SET_ID:(state,id)=>{
            state.id=id
        },
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_NAME: (state, name) => {
            state.name = name
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },
        SET_MENUS: (state, menus) => {
            state.menus = menus
        }
    },
    actions: {
        Login({commit}, userinfo) {//登陆
            return new Promise((resolve, reject) => {
                post('user/user/login', userinfo).then(data => {
                    commit('SET_TOKEN', data.data.token);
                    commit('SET_ID', data.data.id);
                    commit('SET_NAME', data.data.name);
                    resolve(data);
                }).catch(error => {
                    reject(error);
                });
            });
        },
        updateToken({commit}, token){//更新token
            commit('SET_TOKEN', token);
        },
        loginOut({commit}) {
            return new Promise((resolve) => {
                commit('SET_ID',null);
                commit('SET_NAME',null);
                commit('SET_TOKEN',null);
                commit('SET_MENUS',null);
                commit('SET_ROLES',null);
                resolve();
            });
        },
        getMenu({commit,state}){//获取权限菜单
            return new Promise((resolve, reject) => {
                post('user/resources/getResourcesByUserId', {userId:state.id,isn:-1,pid:-1}).then(data => {
                    let arr = [{
                        id:null,
                        path: '/dashboard',
                        component: Layout,
                        redirect: '/dashboard/index.scss',
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
                    let result= arr.concat(filterAsyncRouter(data.data));
                    commit('SET_MENUS', result);
                    resolve(result);
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
