<template>
    <div class="editInterface tui-wh100">
        <el-form ref="form" label-width="6em">
            <el-form-item label="接口名称" class="is-required">
                <el-input v-model="form.name" v-validate
                          data-rules="required" validate-name="name" validate-type="keyup"
                          validate-tips-required="请输入接口名称"></el-input>
                <el-alert v-if="errors.get('name')!=null" :title="errors.get('name')" type="error"/>
            </el-form-item>
            <el-form-item label="状态" class="is-required">
                <el-radio-group v-model="form.status">
                    <el-radio :label="1">启用</el-radio>
                    <el-radio :label="0">禁用</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="方法:" class="wid50"  >
                <span>{{form.method}}</span>
            </el-form-item>
            <el-form-item label="请求类型:"  class="wid50" >
                <span>{{form.type}}</span>
            </el-form-item>
            <el-form-item label="接口地址:"  >
                <span>{{form.url}}</span>
            </el-form-item>
            <el-form-item label="访问路径:"  >
                <span>{{form.path}}</span>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
                <el-button @click="showCurrentDialog = false">取 消</el-button>
                <el-button type="primary" @click="onSubmit">确 定</el-button>
        </span>
    </div>
</template>

<script>
    export default {
        name: "editInterface",
        props: {
            showDialog: Boolean,//是否显示dialog
            editData: {
                type: Object,
                default: null
            }
        },
        data() {
            return {
                form: {
                    id: '',
                    name: '',
                    status:1,
                },//表单数据
                showCurrentDialog: this.showDialog,//是否显示选择当前的dialog
            }
        },
        watch: {
            showCurrentDialog(value) {
                if (value === false) {
                    this.$emit("update:showDialog", false);
                }
            }
        },
        created() {
            this.form = Object.assign(this.form, this.editData);
        },
        mounted() {
        },
        methods: {
            //提交
            onSubmit() {
                if (this.$validator.checkAll()) {
                    let editData = Object.assign({}, this.form);
                    this.$http.post("/dockinginterface/manager/editInterface", editData).then(res => {
                        if (res['data']['isSuccess']) {
                            this.showCurrentDialog = false;
                            this.$message({
                                message: res['msg'],
                                type: 'success'
                            });
                            this.$emit("reloadData", null);
                        } else {
                            this.$message.error(res['msg']);
                        }
                    });
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .dialog-footer {
        text-align: right;
        display: block;
    }

    .el-alert {
        padding: 0 16px;
    }

    .wid50 {
        width: 50%;
        display: inline-block;
    }
</style>