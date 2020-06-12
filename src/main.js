import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import http from './plugins/http';
import utils from './utils/utils';
import filter from './plugins/filter';
import bus from './plugins/bus';
import goback from './directives/goback';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import animated from 'animate.css';
import validate from './plugins/validate/plugin';
import '@/styles/index.scss';
import '@/styles/rem.js';
import '@/icons'; // icon
let VueTouch = require('vue-touch');



Vue.config.productionTip = false;

//ui框架
Vue.use(ElementUI);
//动画样式
Vue.use(animated);
//请求
Vue.use(http);
//工具类
Vue.utils = utils;
Vue.prototype.$utils = Vue.utils;
//事件总线
Vue.prototype.$bus = bus;
//指令
Vue.use(goback);
//过滤器
Object.keys(filter).forEach(key=>Vue.filter(key,filter[key]));
//表单校验插件
Vue.use(validate);
//滑动事件
Vue.use(VueTouch, {name: 'v-touch'});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
