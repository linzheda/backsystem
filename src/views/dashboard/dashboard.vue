<template>
    <div class="dashboard tui-wh100">
        <serverinfo v-if="data.value=='server'"></serverinfo>
        <pic-dashboard v-if="data.value=='pic'"></pic-dashboard>
    </div>
</template>

<script>
    import Serverinfo from "./serverinfo";
    import PicDashboard from "./picDashboard";

    export default {
        name: "dashboard",
        components: {PicDashboard, Serverinfo},
        data() {
            return {
                data:{},//数据
            }
        },
        created() {
            this.getSystem();
        },
        mounted() {
        },
        methods: {
            //获取参数
            getSystem(){
                this.$http.post('pub/pubCtr/getSysParam',{code:'dashboard'}).then(res=>{
                    this.data=res.data;
                });
            }
        }
    }
</script>

<style scoped lang="scss">


</style>