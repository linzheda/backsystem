<template>
    <div class="tui-wh100">
        <page-iframe id="hystrixdashboard-iframe" :url="url"/>
    </div>
</template>

<script>
    import PageIframe from "../../components/pageIframe/pageIframe";

    export default {
        name: "hystrixDashboard",
        components: {PageIframe},
        data(){
            return {
                url:{}
            }
        },
        created() {
            let attr=this.$route.params;
            this.url = attr['attr'];
        },
        mounted() {
            this.init();
        },
        methods:{
            init(){
                let turine='http://localhost:8090/actuator/hystrix.stream';
                console.log(turine);
            }
        }
    }
</script>

<style scoped lang="scss">

</style>
