import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import http from './plugins/http';
import utils from './utils/utils';
import permissions from './utils/permissions';
import filter from './plugins/filter';
import bus from './plugins/bus';
import goback from './directives/goback';
import has from './directives/has';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import animated from 'animate.css';
import validate from './plugins/validate/plugin';
import '@/styles/index.scss';
// import '@/styles/rem.js';
import '@/icons'; // icon
//findebug
/*import * as fundebug from "fundebug-javascript";
import fundebugVue from "fundebug-vue";
require('fundebug-revideo');
if (process.env.NODE_ENV != 'dev') {
    //findebug
    fundebug.apikey = "e20eeef4715ea880ce6db4653e6b846f7a43cc4453ba169ce166a90a599559af"
    fundebugVue(fundebug, Vue);
}*/

Vue.config.productionTip = process.env.NODE_ENV !== 'dev';
//ui框架
Vue.use(ElementUI);
//动画样式
Vue.use(animated);
//请求
Vue.use(http);
//工具类
Vue.utils = utils;
Vue.prototype.$utils = Vue.utils;
//权限控制
Vue.permissions = permissions;
Vue.prototype.$permissions = Vue.permissions;
//事件总线
Vue.prototype.$bus = bus;
//指令
Vue.use(goback);
Vue.use(has);
//过滤器
Object.keys(filter).forEach(key => Vue.filter(key, filter[key]));
//表单校验插件
Vue.use(validate);


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
