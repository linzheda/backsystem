<template>
    <el-menu-item v-if="hasOneShowingChild(menuItem.children,menuItem)" :index="onlyOneChild.name"
                  @click="goPage(onlyOneChild.name)">
        <template v-if="isNotEmpty(onlyOneChild.meta)">
            <svg-icon class="svg-icon" :icon-class="onlyOneChild.meta.icon"/>
        </template>
        <span slot="title">{{onlyOneChild.meta.title}}</span>
    </el-menu-item>
    <el-submenu v-else ref="subMenu" :index="menuItem.path">
        <template slot="title">
            <template v-if="isNotEmpty(menuItem.meta)">
                <svg-icon class="svg-icon" :icon-class="menuItem.meta.icon"/>
            </template>
            <span slot="title">{{menuItem.meta.title}}</span>
        </template>
        <menu-item v-for="child in menuItem.children" :menu-item="child" :key="child.path"/>
    </el-submenu>
</template>

<script>
    export default {
        name: "menuItem",
        props: {
            menuItem: {
                type: Object,
                default: null
            }
        },
        data() {
            return {
                onlyOneChild: {}
            }
        },
        mounted() {
        },
        methods: {
            isNotEmpty(obj){
                return this.$utils.isNotEmpty(obj['icon']);
            },
            hasOneShowingChild(children = [], parent) {//判断是否只有一个孩子节点
                if (children == null) {
                    children = [];
                }
                const showingChildren = children.filter(item => {
                    if (item.hidden) {
                        return false
                    } else {
                        this.onlyOneChild = item;
                        return true
                    }
                });
                if (showingChildren.length === 1) {
                    return true
                }
                if (showingChildren.length === 0) {
                    this.onlyOneChild = {...parent}
                    return true
                }
                return false
            },
            goPage(name) {//进入对应的页面
                if (this.$route.name!=name){
                    this.$router.push({name: name, params: this.menuItem.meta});
                }
            },
        }
    }
</script>

<style scoped lang="scss">
    .svg-icon {
        vertical-align: middle;
        margin-right: 10px;
        width: 24px;
        text-align: center;
        font-size: 18px;
    }
</style>
