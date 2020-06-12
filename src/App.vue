<template>
    <div id="app">
        <router-view/>
    </div>
</template>
<script>
    export default {
        name: 'app',
        created() {
            this.$store.dispatch('initEnv',process.env.NODE_ENV);
        }
    }
</script>

<style lang="scss">
</style>
