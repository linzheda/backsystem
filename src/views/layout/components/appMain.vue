<template>
    <section class="app-main">
        <transition name="fade-transform" mode="out-in">
            <keep-alive :include="cachedViews">
                <router-view :key="key" />
            </keep-alive>
        </transition>
    </section>
</template>

<script>
    export default {
        name: "appMain",
        computed: {
            cachedViews() {
                let temp=this.$store.getters.tagsView;
                let data=[];
                temp.forEach(item => {
                    data.push(item['name']);
                });
                return data;
            },
            key() {
                return this.$route.path;
            }
        }
    }
</script>

<style scoped lang="scss">
    .app-main {
        /* 50= navbar  50  */
        height: calc(100% - 50px);
        width: 100%;
        position: relative;
        padding: 15px;
        overflow: hidden;
        box-sizing: border-box;
    }

    .fixed-header+.app-main {
        /*padding-top: 50px;*/
        margin-top: 50px;
    }

    .hasTagsView {
        .app-main {
            /* 84 = navbar + tags-view = 50 + 34 */
            height: calc(100% - 85px);
        }

        .fixed-header+.app-main {
            /*padding-top: 84px;*/
            margin-top: 84px;

        }
    }

</style>

