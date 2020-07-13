import axios from 'axios'
import {Message, MessageBox} from 'element-ui'
import store from '../store'
import utils from '../utils/utils'


// 创建axios实例
const instance = axios.create({
    headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},//设置以表单的形式提交  避免发两次请求
    timeout: 50000 // 请求超时时间
});
// request拦截器
instance.interceptors.request.use(config => {
    // 让每个请求携带自定义token 请根据实际情况自行修改
    const token = store.getters.token;
    config.headers.common['Authorization'] = token;
    return config;
}, error => {
    // eslint-disable-next-line no-console
    console.log(error); // for debug
    Promise.reject(error);
});

// respone拦截器
instance.interceptors.response.use(
    response => {
        //code为非200是抛错 可结合自己业务进行修改
        const res = response;
        if (res.status !== 200) {
            // 401:未登录;
            if (res.status === 401 || res.status === 403) {
                Message({
                    message: res.message,
                    type: 'error',
                    duration: 3 * 1000
                });
            }
            return Promise.reject(response);
        } else {
            if (utils.isNotEmpty(response.headers['authorization'])) {
                store.dispatch("updateToken", response.headers['authorization']);
            }
            return response.data;
        }
    },
    error => {
        if (error.response.status === 401 || error.response.status === 403) {
            MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
                confirmButtonText: '重新登录',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                store.dispatch('loginOut').then(() => {
                    location.reload()// 为了重新实例化vue-router对象 避免bug
                });
            });
        } else {
            Message({
                message: error.message,
                type: 'error',
                duration: 3 * 1000
            });
        }
        // eslint-disable-next-line no-console
        console.log('err' + error);// for debug
        return Promise.reject(error);
    }
);

//转换为键值对的形式
function transformRequest(data) {
    let str = [];
    for (let key in data) {
        let value=utils.isEmpty(data[key])?'':data[key];
        str.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
    }
    return str.join("&");
}


//获取所有配置的url
let result={};
for(let key in process.env){
    if(key.endsWith('_URL')){
        let newkey = key.replace("VUE_APP_", '').replace("_URL", '');
        newkey = newkey.toLocaleLowerCase();
        result[newkey] = process.env[key];
    }
}
const urlApi = result;


const get = (url, params = {}, isCheck = true, baseUrl = urlApi['base'],isTransform=true) => {
    url = baseUrl + url;
    //转换为键值对的形式
    if(isTransform){
        params=transformRequest(params)
    }
    //检查约定的状态码
    if (isCheck) {
        return instance.get(url, params).then(res => {
            if (res.code != 200) {
                Message({
                    message: res.msg,
                    type: 'error',
                    duration: 3 * 1000
                });
            } else {
                return res;
            }
        });
    } else {
        return instance.get(url, params);
    }
};

const post = (url, params = {}, isCheck = true, baseUrl = urlApi['base'],isTransform=true) => {
    url = baseUrl + url;
    //转换为键值对的形式
    if(isTransform){
        params=transformRequest(params)
    }
    //检查约定的状态码
    if (isCheck) {
        return instance.post(url, params).then(res => {
            if (res.code != 200) {
                Message({
                    message: res.msg,
                    type: 'error',
                    duration: 3 * 1000
                });
            } else {
                return res;
            }
        });
    } else {
        return instance.post(url, params);
    }
};

export {
    get,
    post,
    urlApi
}

export default {
    install(Vue) {
        Vue.http = {get, post, urlApi};
        Vue.prototype.$http = Vue.http;
    }
};

