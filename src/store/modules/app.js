const app = {
    state: {
        env: process.env.NODE_ENV,//环境 dev开发 prod生产
        tagsView: [],//tags数组集合
        cachedViews: [],//路由缓存数组集合
    },
    mutations: {
        SET_EVN: (state, env) => {//设置环境
            state.env = env
        },
        ADD_TAGSVIEW: (state, view) => {//设置要保存
            if (state.tagsView.some(v => v.path == view.path)) return;
            state.tagsView.push(Object.assign({}, view, {
                title: view.meta.title || 'no-name'
            }));
            localStorage.setItem("tagsView", state.tagsView);
        },
        ADD_CACHED_VIEW: (state, view) => {//设置要保存
            if (state.cachedViews.includes(view.name)) return
            if (!view.meta.noCache) {
                state.cachedViews.push(view.name)
            }
            localStorage.setItem("cachedViews", state.cachedViews);
        },

        DEL_TAGSVIEW: (state, view) => {
            for (let [i, v] of state.tagsView.entries()) {
                if (v.path == view.path) {
                    state.tagsView.splice(i, 1);
                    break
                }
            }
            localStorage.setItem("tagsView", state.tagsView);
        },
        DEL_CACHED_VIEW: (state, view) => {
            const index = state.cachedViews.indexOf(view.name)
            index > -1 && state.cachedViews.splice(index, 1)
            localStorage.setItem("cachedViews", state.cachedViews);
        },
        DEL_OTHER_TAGSVIEW: (state, view) => {
            state.tagsView = state.tagsView.filter(v => {
                return v.meta.affix || v.path === view.path
            });
            localStorage.setItem("tagsView", state.tagsView);
        },
        DEL_OTHERS_CACHED_VIEWS: (state, view) => {
            const index = state.cachedViews.indexOf(view.name)
            if (index > -1) {
                state.cachedViews = state.cachedViews.slice(index, index + 1)
            } else {
                // if index = -1, there is no cached tags
                state.cachedViews = []
            }
            localStorage.setItem("cachedViews", state.cachedViews);
        },
        DEL_ALL_TAGSVIEW: (state) => {
            state.tagsView = state.tagsView.filter(v => {
                return v.meta.affix
            });
            localStorage.setItem("tagsView", state.tagsView);
        },
        DEL_ALL_CACHED_VIEWS: state => {
            state.cachedViews = []
            localStorage.setItem("cachedViews", state.cachedViews);
        },

    },
    actions: {
        initEnv({commit}, env) {//项目初始化是设置环境
            commit('SET_EVN', env);
        },
        addTagsView({commit}, view) {//新增
            if (view.matched && view.matched.length >= 3) { // 若为三级及其以上路由点击打开标签页时，将三级路由或以上的根目录路由塞入缓存路由name list中
                commit('ADD_CACHED_VIEW', view.matched[1])
            }
            commit('ADD_TAGSVIEW', view);
            commit('ADD_CACHED_VIEW', view);
        },
        deleteTagsView({commit, state}, view) { //删除数组存放的路由之后，需要再去刷新路由，这是一个异步的过程，需要有回掉函数，所以使用并返回promise对象，也可以让组件在调用的时候接着使用.then的方法
            return new Promise((resolve) => { //resolve方法：未来成功后回掉的方法
                if (view.matched && view.matched.length >= 3) { // 若为三级及其以上路由关闭当前标签页时，将3级路由以上的根目录name 从list中删除
                    commit('DEL_CACHED_VIEW', view.matched[1])
                }
                commit('DEL_TAGSVIEW', view);
                commit('DEL_CACHED_VIEW', view);
                resolve([...state.tagsView]);
            });
        },
        deleteOtherTagsView({commit, state}, view) {//关闭其他
            return new Promise(resolve => {
                commit('DEL_OTHER_TAGSVIEW', view);
                commit('DEL_OTHERS_CACHED_VIEWS', view);
                resolve([...state.tagsView]);
            });
        },
        deleteAllTagsViews({commit, state}) {//关闭所有
            return new Promise(resolve => {
                commit('DEL_ALL_TAGSVIEW');
                commit('DEL_ALL_CACHED_VIEWS');
                resolve([...state.tagsView]);
            });
        },


    }
};

export default app
