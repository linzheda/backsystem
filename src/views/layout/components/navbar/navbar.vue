<template>
    <div class="eui-navbar">
        <div class="eui-hamburger" @click="clickHamburger">
            <i class="hamburger" :class="{'el-icon-s-fold':isClose===false,'el-icon-s-unfold':isClose}"/>
            <breadcrumb class="breadcrumb"/>
        </div>
        <div class="eui-rightMune">
            <div class="eui-theme">
                <theme-picker ref="themepicker" @change="themeChange"/>
                <label>主题</label>
            </div>
            <div class="eui-screen">
                <span @click="handleFullScreen()" title="全屏显示">
                    <svg-icon :icon-class="fullScreen?'shouqi':'zhankai'"/>
                    <label >{{fullScreen?'取消全屏':'全屏显示'}}</label>
                </span>
            </div>
            <el-dropdown size="small">
                <div class="eui-user">
                    <img src="~@/assets/images/home/userheader1.jpg" alt="">
                    <span>{{name}}</span>
                    <i class="el-icon-caret-bottom"/>
                </div>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>用户信息</el-dropdown-item>
                    <el-dropdown-item @click.native="openUpdatePwd()" >修改密码</el-dropdown-item>
                    <el-dropdown-item divided @click.native="loginOut()">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <el-dialog
                v-if="showUpdatePwd"
                :append-to-body="true"
                title="修改密码"
                :visible.sync="showUpdatePwd"
                width="30%">
            <update-password  @isVisible="showUpdatePwd=false" />
        </el-dialog>

    </div>
</template>

<script>
    import Breadcrumb from "../breadcrumb/breadcrumb";
    import ThemePicker from "../../../../components/ThemePicker/themePicker";
    import UpdatePassword from "../../../user/updatePassword/updatePassword";
    export default {
        name: "navbar",
        components: { UpdatePassword, ThemePicker, Breadcrumb},
        props: {
            isCollapse: {
                type: Boolean,
                default: false
            },
        },
        data() {
            return {
                fullScreen: false,//是否全屏
                isClose: false,//是否收起侧边栏测单
                showUpdatePwd:false,//是否显示修改密码
            }
        },
        computed: {
            theme() {//主题
                return this.$store.state.settings.theme
            },
            name(){//用户名
                return this.$store.getters.name;
            }
        },
        created() {
            this.isClose = this.isCollapse;
        },
        methods: {
            //点击图标显示展开
            clickHamburger() {
                this.isClose = !this.isClose;
                this.$emit("isCollapse", this.isClose);
            },
            //全屏 和退出全屏
            handleFullScreen() {
                if (this.fullScreen) {//退出全屏
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    }
                } else {//全屏
                    var element = document.documentElement;
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.msRequestFullscreen) {
                        element.msRequestFullscreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.webkitRequestFullscreen) {
                        element.webkitRequestFullscreen();
                    }
                }
                this.fullScreen = !this.fullScreen;
            },
            //修改主题色
            themeChange(val) {
                this.$store.dispatch('changeSetting', {key: 'theme', value: val});
            },
            //退出登录
            loginOut(){
                this.$store.dispatch("loginOut").then(() => {
                    location.reload();
                });
            },
            //打开修改密码
            openUpdatePwd(){
                this.$nextTick(()=>{
                    this.showUpdatePwd=true;
                });
            }



        }
    }
</script>

<style scoped lang="scss">
    .eui-navbar {
        height: 50px;
        overflow: hidden;
        position: relative;
        background: #fff;
        box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
        padding-right: 20px;
        z-index: 100;

        .eui-hamburger {
            padding: 0 24px;
            height: 100%;
            float: left;
            display: flex;
            align-items: center;
            font-size: 20px;
            cursor: pointer;
            transition: background .3s;
            -webkit-tap-highlight-color: transparent;

            &:hover {
                background: rgba(0, 0, 0, .025)
            }
        }

        .eui-rightMune {
            float: right;
            display: flex;

            .eui-screen, .eui-user, .eui-theme {
                display: flex;
                align-items: center;
                line-height: 50px;
                padding: 0 10px;
                cursor: pointer;
            }

            .eui-theme {
                .el-color-picker{
                    height: auto;
                }
            }

            .eui-user {
                img {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }

                span {
                    padding: 0 6px;
                }
            }
        }
    }


</style>
