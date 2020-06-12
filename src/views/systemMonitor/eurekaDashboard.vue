<template>
    <div class="tui-wh100">
        <page-iframe :url="url"/>
    </div>
</template>

<script>
    import PageIframe from "../../components/pageIframe/pageIframe";
    export default {
        name: "eurekaDashboard",
        components: {PageIframe},
        data(){
            return {
                url:{}
            }
        },
        created() {
            let attr=this.$route.params;
            this.url = attr['attr'];
        }
    }
</script>

<style scoped lang="scss">

</style>
