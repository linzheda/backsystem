<template>
    <div>
        <el-scrollbar wrap-class="scrollbar-wrapper">
            <el-menu
                    :collapse="isCollapse"
                    :default-active="activeMenu"
                    :background-color="variables.menuBg"
                    :text-color="variables.menuText"
                    :active-text-color="theme"
            >
                <menu-item v-for="item in menus" :menu-item="item" :key="item.path"/>
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script>
    import MenuItem from "./menuItem";
    import variables from '@/styles/variables.scss';
    export default {
        name: "sidebar",
        components: {MenuItem},
        props: {
            isCollapse: {
                type: Boolean,
                default: false
            },
        },
        data() {
            return {}
        },
        created() {
        },
        computed: {
            menus() {
                return this.$store.getters.menus;
            },
            activeMenu() {//获取当前那个路由被选中
                const route = this.$route;
                const {meta, name} = route;
                if (meta.activeMenu) {
                    return meta.activeMenu;
                }
                return name;
            },
            variables() {
                return variables
            },
            theme(){
                return this.$store.getters.theme;
            }
        },
    }
</script>

<style scoped lang="scss">


</style>
