<template>
    <div class="logDetail tui-wh100">
        <el-form ref="form" label-width="6em">
            <el-form-item label="系统模块" class="wid50">
                <span>{{form.module}}</span>
            </el-form-item>
            <el-form-item label="操作描述" class="wid50" >
                <span>{{form.operdesc}}</span>
            </el-form-item>
            <el-form-item label="登录信息"  >
                <span>{{form.operatorid_text}}{{"/"+form.ipaddr}}</span>
            </el-form-item>
            <el-form-item label="请求地址"  >
                <span>{{form.requrl}}</span>
            </el-form-item>
            <el-form-item label="请求方式"  class="wid50" >
                <span>{{form.reqtype}}</span>
            </el-form-item>
            <el-form-item label="操作类型" class="wid50" >
                <span>{{form.opertype_text}}</span>
            </el-form-item>
            <el-form-item label="操作方法"  >
                <span>{{form.reqmethod}}</span>
            </el-form-item>
            <el-form-item label="状态"  >
                <span>{{form.status_text}}</span>
            </el-form-item>
            <el-form-item label="请求参数">
                <el-input type="textarea" v-model="form.reqparam" disabled></el-input>
            </el-form-item>
            <el-form-item label="返回参数">
                <el-input type="textarea" v-model="form.outresult" disabled></el-input>
            </el-form-item>
            <el-form-item label="错误信息" v-if="form.errormsg!=null">
                <el-input type="textarea" v-model="form.errormsg" disabled></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
                <el-button @click="showCurrentDialog = false">关 闭</el-button>
        </span>
    </div>
</template>

<script>
    export default {
        name: "logDetail",
        props: {
            showDialog: Boolean,//是否显示dialog
            editData: {
                type: Object,
                default: null
            }
        },
        data() {
            return {
                form:{},//表单数据
                showCurrentDialog: this.showDialog,//是否显示选择当前的dialog
            }
        },
        watch: {
            showCurrentDialog(value) {
                if (value === false) {
                    this.$emit("update:showDialog", false);
                }
            },
        },
        created() {
            this.form = Object.assign( this.form, this.editData);
        },
        mounted() {
        },
        methods: {}
    }
</script>

<style scoped lang="scss">
    .dialog-footer {
        text-align: right;
        display: block;
    }

    .el-alert{
        padding: 0 16px;
    }

    .wid50 {
        width: 50%;
        display: inline-block;
    }
</style>