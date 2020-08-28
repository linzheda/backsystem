import utils from "@/utils/utils";


function has(value, permissions) {
    let isExist = false;
    if (utils.isEmpty(permissions)) {
        return false;
    }
    let arr = permissions.split(",");
    //校验
    if(value.includes('||')){
        let values=value.split('||');
        for (let item of arr) {
            if (values.includes(item)) {
                isExist = true;
                break;
            }
        }
    }else{
        for (let item of arr) {
            if (item === value) {
                isExist = true;
                break;
            }
        }
    }
    return isExist;
}



export default {
    install(Vue) {
        Vue.directive('has', {
            // 当绑定元素插入到 DOM 中。
            bind: function (el,binding,vnode) {
                // 获取页面按钮权限
                let btnPermissionsArr = vnode.context.$route.meta.btnPermissions;
                if (!has(binding.value, btnPermissionsArr)) {
                    if(el.parentNode){
                        el.parentNode.removeChild(el);
                    }else{
                        el.style.display = 'none';
                    }

                }
            }
        });
    }
}


