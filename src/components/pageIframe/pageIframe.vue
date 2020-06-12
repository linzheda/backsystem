<!--iframe-->
<template>
    <iframe :id="id" :src="url" class="tui-wh100" ></iframe>
</template>

<script>
    export default {
        name: "pageIframe",
        props:{
            url:{
                type:String,
                default:''
            },
            id:{
                type:String,
                default:'page-iframe'
            }
        }
    }
</script>

<style scoped lang="scss">
    iframe{
        border: none;
    }
</style>
