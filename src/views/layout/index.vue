<template>
    <div :class="classObj" class="eui-wrapper">
        <sidebar :is-collapse="isCollapse" class="sidebar-container"/>
        <div :class="{hasTagsView:needTagsView}" class="main-container">
            <div :class="{'fixed-header':fixedHeader}">
                <navbar :is-collapse="isCollapse" @isCollapse="getIsCollapse"/>
                <tags-view v-if="needTagsView"/>
            </div>
            <app-main/>
        </div>
    </div>
</template>

<script>
    import AppMain from "./components/appMain";
    import Sidebar from "./components/sidebar/sidebar";
    import Navbar from "./components/navbar/navbar";
    import TagsView from "./components/tagsView/tagsView";
    import {mapState} from 'vuex'

    export default {
        name: "index",
        components: {TagsView, Navbar, Sidebar, AppMain},
        data() {
            return {
                isCollapse: false
            }
        },
        computed: {
            ...mapState({
                showSettings: state => state.settings.showSettings,
                needTagsView: state => state.settings.showTagsView,
                fixedHeader: state => state.settings.fixedHeader
            }),
            classObj() {
                return {
                    hideSidebar: this.isCollapse,
                    openSidebar: !this.isCollapse,
                }
            }
        },
        methods: {
            getIsCollapse(data) {//判断左侧菜单是否关闭
                this.isCollapse = data;
            }
        }

    }
</script>

<style lang="scss">
    @import '@/styles/mixin.scss';
    @import '@/styles/variables.scss';
    .eui-wrapper{
        position: relative;
        width: 100%;
        height: 100%;
    }
    //头部悬浮固定
    .fixed-header {
        position: fixed;
        top: 0;
        right: 0;
        z-index: 9;
        width: calc(100% - #{$sideBarWidth});
        transition: width 0.28s;
    }

    .hideSidebar .fixed-header {
        width: calc(100% - 54px)
    }


    //侧边栏
    .main-container {
        height: 100%;
        transition: margin-left .28s;
        margin-left: $sideBarWidth;
        position: relative;
    }

    .sidebar-container {
        transition: width 0.28s;
        width: $sideBarWidth !important;
        background-color: $menuBg;
        height: 100%;
        position: fixed;
        font-size: 0;
        top: 0;
        bottom: 0;
        left: 0;
        z-index: 1001;
        overflow: hidden;

        // reset element-ui css
        .horizontal-collapse-transition {
            transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out;
        }

        .scrollbar-wrapper {
            overflow-x: hidden !important;
        }

        .el-scrollbar__bar.is-vertical {
            right: 0;
        }

        .el-scrollbar {
            height: calc(100% - 50px);
        }

        .is-horizontal {
            display: none;
        }

        a {
            display: inline-block;
            width: 100%;
            overflow: hidden;
        }

        .svg-icon {
            margin-right: 16px;
        }

        .el-menu {
            border: none;
            height: 100%;
            width: 100% !important;
        }

        // menu hover
        .submenu-title-noDropdown,
        .el-submenu__title {
            &:hover {
                background-color: $menuHover !important;
            }
        }

        .is-active>.el-submenu__title {
            color: $subMenuActiveText !important;
        }

        & .nest-menu .el-submenu>.el-submenu__title,
        & .el-submenu .el-menu-item {
            min-width: $sideBarWidth !important;
            background-color: $subMenuBg !important;

            &:hover {
                background-color: $subMenuHover !important;
            }
        }
    }

    .hideSidebar {
        .sidebar-container {
            width: 64px !important;
        }

        .main-container {
            margin-left: 64px;
        }

        .submenu-title-noDropdown {
            padding: 0 !important;
            position: relative;

            .el-tooltip {
                padding: 0 !important;

                .svg-icon {
                    margin-left: 20px;
                }
            }
        }

        .el-submenu {
            overflow: hidden;
            &>.el-submenu__title {
                .el-submenu__icon-arrow {
                    display: none;
                }
            }
        }

        .el-menu--collapse {
            .el-submenu {
                &>.el-submenu__title {
                    &>span {
                        height: 0;
                        width: 0;
                        overflow: hidden;
                        visibility: hidden;
                        display: inline-block;
                    }
                }
            }
        }
    }

    .el-menu--collapse .el-menu .el-submenu {
        min-width: $sideBarWidth !important;
    }

    // mobile responsive
    .mobile {
        .main-container {
            margin-left: 0;
        }

        .sidebar-container {
            transition: transform .28s;
            width: $sideBarWidth !important;
        }

        &.hideSidebar {
            .sidebar-container {
                pointer-events: none;
                transition-duration: 0.3s;
                transform: translate3d(-$sideBarWidth, 0, 0);
            }
        }
    }

    .withoutAnimation {

        .main-container,
        .sidebar-container {
            transition: none;
        }
    }


</style>


