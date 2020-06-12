const app = {
    state: {
        imei: '1234567',//设备号
        tagsView: [],//tags数组集合
        env:'dev',//环境 dev开发 production生产
    },
    mutations: {
        SET_IMEI: (state, imei) => {//设置设备号
            state.imei = imei
        },
        SET_EVN:(state, env)=>{//设置环境
            state.env=env
        },
        ADD_TAGSVIEW: (state, view) => {//设置要保存
            if (state.tagsView.some(v => v.path == view.path)) return;
            state.tagsView.push(Object.assign({}, view, {
                title: view.meta.title || 'no-name'
            }));
        },
        DELETE_TAGSVIEW: (state, view) => {
            for (let [i, v] of state.tagsView.entries()) {
                if (v.path == view.path) {
                    state.tagsView.splice(i, 1);
                    break
                }
            }
        },
        DELETEOTHER_TAGSVIEW: (state, view) => {
            state.tagsView = state.tagsView.filter(v => {
                return v.meta.affix || v.path === view.path
            });
        },
        DELETEALL_TAGSVIEW:(state)=>{
            state.tagsView = state.tagsView.filter(v => {
                return v.meta.affix
            });
        }

    },
    actions: {
        addTagsView({commit}, view) {//新增
            commit('ADD_TAGSVIEW', view);
        },
        deleteTagsView({commit, state}, view) { //删除数组存放的路由之后，需要再去刷新路由，这是一个异步的过程，需要有回掉函数，所以使用并返回promise对象，也可以让组件在调用的时候接着使用.then的方法
            return new Promise((resolve) => { //resolve方法：未来成功后回掉的方法
                commit('DELETE_TAGSVIEW', view);
                resolve([...state.tagsView]);
            });
        },
        deleteOtherTagsView({commit, state}, view) {//关闭其他
            return new Promise(resolve => {
                commit('DELETEOTHER_TAGSVIEW', view);
                resolve([...state.tagsView]);
            });
        },
        deleteAllTagsViews({commit, state}){//关闭所有
            return new Promise(resolve => {
                commit('DELETEALL_TAGSVIEW');
                resolve([...state.tagsView]);
            });
        },
        initEnv({commit}, env){//项目初始化是设置环境
            commit('SET_EVN',env);
        },

    }
};

export default app
