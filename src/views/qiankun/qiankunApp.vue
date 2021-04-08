/**
* 描述:嵌入app微应用
*
**/
<template>
    <div class="qiankunApp tui-wh100">
        <p>乾坤:嵌入app微应用</p>
        <section id="app-qiankun"></section>
    </div>
</template>

<script>
    import startQiankun from "@/micro";
    // import Layout from "@/views/layout";

    export default {
        name: "qiankunApp",
        data() {
            return {}
        },
        created() {

        },
        mounted() {
            let app = [{
                name: "VueMicroApp",
                entry: "//localhost:9101",
                container: "#app-qiankun",
                activeRule: "qiankunApp/app",
            }];
            startQiankun(app);
            // let route = [{
            //     path: 'qiankunApp',
            //     component: Layout,
            //     children: [{
            //         path: 'app',
            //         component: () => import('@/views/qiankun/qiankunApp'),
            //     }]
            // }];
            // this.$router.addRoutes(route)
        },
        methods: {
        }
    }
</script>

<style scoped lang="scss">
    .qiankunApp{
        overflow-y: scroll;
        overflow-x: hidden;
    }
    #app-qiankun{
        display: inline-block;
        width: 375px;
        height: 667px;
    }
</style>