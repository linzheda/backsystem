import axios from 'axios'
import {Message, MessageBox,Loading} from 'element-ui'
import store from '../store'
import utils from '../utils/utils'



// 创建axios实例
const instance = axios.create({
    headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},//设置以表单的形式提交  避免发两次请求
    timeout: 50000 // 请求超时时间
});


const clearTimeoutByUrl = (url, requestList) => {
    let index =requestList.findIndex(item=>{
        return url === item['url'];
    });
    if (index!=-1){
        clearTimeout(requestList[index]['timeId']);
        requestList.splice(index, 1);
    }
}

//定义一个请求次数的变量，用来记录当前页面总共请求的次数
let loadingCount = 0;
let loadingInstance=null;
let requestTimeIdList=[];

const showLoading = () => {
    loadingCount++;
    if(loadingCount>0){
        loadingInstance=Loading.service({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
    }
}

const closeLoading = () => {
    if(loadingCount<=0){
        return;
    }
    loadingCount--;
    if(loadingCount===0){
        loadingInstance.close();
    }
}

// request拦截器
instance.interceptors.request.use(config => {
    // 让每个请求携带自定义token 请根据实际情况自行修改
    const token = store.getters.token;
    config.headers.common['Authorization'] = token;
    if(config['showLoading']){
        // 如果接口请求小于200ms的话 那么就不显示loading
        const timeId = setTimeout(() => {
            showLoading();// 显示loading
        }, 300);
        requestTimeIdList.push({
            timeId: timeId,
            url: config.url
        });
    }
    return config;
}, error => {
    if(error.config['showLoading']){
        closeLoading();
    }
    // eslint-disable-next-line no-console
    console.log(error); // for debug
    Promise.reject(error);
});

// respone拦截器
instance.interceptors.response.use(
    response => {
        if(response.config['showLoading']){
            // clear 200ms 后准备展示的loading
            clearTimeoutByUrl(response.config.url, requestTimeIdList);
            closeLoading();
        }
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
        if(error.config['showLoading']){
            // clear 200ms 后准备展示的loading
            clearTimeoutByUrl(error.config.url, requestTimeIdList);
            closeLoading();
        }
        if (error.response.status === 401 || error.response.status === 403) {
            MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
                confirmButtonText: '重新登录',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                store.dispatch('loginOut', 0).then(() => {
                    window.location.href = window.location.href.slice(0, window.location.href.indexOf('#')); // 必须刷新到锚点
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
        let value = utils.isEmpty(data[key]) ? '' : data[key];
        if (typeof value == 'string') {
            value = value.trim();
        }
        str.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
    }
    return str.join("&");
}


//获取所有配置的url
let result = {};
for (let key in process.env) {
    if (key.endsWith('_URL')) {
        let newkey = key.replace("VUE_APP_", '').replace("_URL", '');
        newkey = newkey.toLocaleLowerCase();
        result[newkey] = process.env[key];
        if (newkey === 'base' && process.env.NODE_ENV === 'dev') {
            result[newkey] = '/api/';
        }
    }
}
const urlApi = result;


const get = (url, params = {}, config = {
    isCheck: true,
    baseUrl: urlApi['base'],
    isTransform: true,
    showLoading: false
}) => {
    return doRequest('get', url, params, config)
};

const post = (url, params = {}, config = {
    isCheck: true,
    baseUrl: urlApi['base'],
    isTransform: true,
    showLoading: false
}) => {
    return doRequest('post', url, params, config)
};

const postFile = (url, params = {}, config = {
    isCheck: true,
    baseUrl: urlApi['base'],
    isTransform: true,
    showLoading: false
}) => {
    return doRequest('file', url, params, config);
}

function doRequest(way = 'post', url, params = {}, configParam = {
    isCheck: true,
    baseUrl: urlApi['base'],
    isTransform: true,
    showLoading: false
}) {

    let config = Object.assign({
        isCheck: true,
        baseUrl: urlApi['base'],
        isTransform: true,
        showLoading: false
    }, configParam);

    url = config['baseUrl'] + url;
    //转换为键值对的形式
    if (config['isTransform']) {
        params = transformRequest(params)
    }
    //检查约定的状态码
    if (config['isCheck']) {
        return request(way, url, params, config['showLoading']).then(res => {
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
        return request(way, url, params, config['showLoading']);
    }
}

async function request(way, url, params, showLoading) {
    let config = {
        showLoading: showLoading
    };
    switch (way) {
        case 'post':
            return instance.post(url, params, config);
        case 'get':
            return instance.get(url, params, config);
        case 'file':
            config = Object.assign(config, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            return instance.post(url, params, config);
    }
}


export {
    get,
    post,
    postFile,
    urlApi
}

export default {
    install(Vue) {
        Vue.http = {get, post, postFile, urlApi};
        Vue.prototype.$http = Vue.http;
    }
};

