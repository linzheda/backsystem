<template>
    <div class="404 tui-wh100">
        <div class="error">
            <div class="com">
                <img :src="require('@/assets/images/pub/404/404.png')" class="icon" />
                <div class="txt">
                    <h3>访问的页面不存在！</h3>
                    <h4>这种错误可能因为：</h4>
                    <p>无法在所请求的端口上访问Web站点</p>
                    <p>Web服务扩展锁定策略阻止本请求</p>
                    <h4>我们建议您：</h4>
                    <p>返回  <router-link :to="{path:'/'}">首页</router-link></p>
                    <p>联系我们客服人员</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "404",
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
    .error{position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);}
    .error .com{display: table;}
    .error .com .icon,.error .com .txt{display: table-cell; vertical-align: middle; white-space: nowrap;}
    .error .com .txt{padding-left: 60px;}
    .error .com .txt h3{font-size: 30px; font-weight: bold; color: #121212; margin: 0 0 18px 0;}
    .error .com .txt h4{line-height: 28px; font-size: 16px; margin: 10px 0 6px 0; color: #121212;}
    .error .com .txt p{position: relative; font-size: 12px; color: #6e6e6e; margin: 0; padding-left: 10px; line-height: 22px;}
    .error .com .txt p::before{content: ''; position: absolute; top: 50%; left: 0; width: 4px; height: 4px; margin-top: -2px; background: #6e6e6e; border-radius: 50%;}
    .error .com .txt p a{color: #42bbed;}
    .error .com .txt p a:hover{text-decoration: underline;}
</style>