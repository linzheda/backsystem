<template>
    <div class="tui-wh100">
        <page-iframe id="hystrixdashboard-iframe" :url="url"/>
    </div>
</template>

<script>
    import $ from 'jquery';
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
                this.$nextTick().then(() => {
                    setTimeout(()=>{
                        $("#hystrixdashboard-iframe").contents().find("#strem").val(turine);
                    },500);

                });
            }
        }
    }
</script>

<style scoped lang="scss">

</style>
