<template>
    <div class="picDashboard tui-wh100">
        <img class="img1" :src="require('@/assets/images/dashboard/1.gif')">
        <img class="img2" :src="require('@/assets/images/dashboard/2.gif')">
    </div>
</template>

<script>
    export default {
        name: "picDashboard",
        data() {
            return {}
        },
        created() {
        },
        mounted() {
        },
        methods: {}
    }
</script>

<style scoped lang="scss">
    .picDashboard{
        background: #E3E3E3;
        text-align: center;
        position: relative;
        display: flex;
    }
    .img1{
        margin: auto;
    }
    .img2{
        width: 200px;
        height: 200px;
        border-radius: 100px;
        position: absolute;
        top: 20px;
        left: 30px;
    }
</style>