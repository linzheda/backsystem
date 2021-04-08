import {registerMicroApps, addGlobalUncaughtErrorHandler, start,} from "qiankun";
import NProgress from "nprogress";
import { Message } from 'element-ui';

export default function (apps) {
    registerMicroApps(apps, {
        beforeLoad: () => {
            // 加载微应用前，加载进度条
            NProgress.start();
            return Promise.resolve();
        },
        afterMount: () => {
            NProgress.done();
            return Promise.resolve();
        },
    });

    addGlobalUncaughtErrorHandler((event) => {
        console.log("qiankun报错了")
        console.log(event)
        const { msg } = event;
        NProgress.done();
        // 加载失败时提示
        if (msg && msg.includes("died in status LOADING_SOURCE_CODE")) {
            Message.error('微应用加载失败，请检查应用是否可运行');
        }
    });

    start({sandbox :{strictStyleIsolation: true}});
}
