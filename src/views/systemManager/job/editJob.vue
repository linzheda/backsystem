<template>
    <div class="editJob">
        <el-form ref="form" label-width="6em">
            <el-form-item label="岗位名称" class="is-required">
                <el-input v-model="form.name" maxlength="20" show-word-limit v-validate
                          data-rules="required" validate-name="name" validate-type="keyup"
                          validate-tips-required="请输入岗位名称"></el-input>
                <el-alert v-if="errors.get('name')!=null" :title="errors.get('name')" type="error"/>
            </el-form-item>
            <el-form-item label="岗位编码" class="is-required" >
                <el-input v-model="form.code" maxlength="20" show-word-limit v-validate
                          data-rules="required" validate-name="code" validate-type="keyup"
                          validate-tips-required="请输入岗位编码"></el-input>
                <el-alert v-if="errors.get('code')!=null" :title="errors.get('code')" type="error"/>
            </el-form-item>
            <el-form-item label="状态" class="wid50 is-required">
                <el-radio-group v-model="form.status">
                    <el-radio :label="1">启用</el-radio>
                    <el-radio :label="0">禁用</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="排序" class="wid50">
                <el-input type="number" v-model="form.seq"></el-input>
            </el-form-item>
            <el-form-item label="描述">
                <el-input type="textarea" maxlength="500" show-word-limit v-model="form.description"></el-input>
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
        name: "editJob",
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
                    id:'',
                    name:'',
                    code:'',
                    description:'',
                    status:1,
                    seq:null,
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
            this.form = Object.assign( this.form, this.editData);
        },
        mounted() {
        },
        methods: {
            //提交
            onSubmit(){
                if(this.$validator.checkAll()){
                    let editData = Object.assign({}, this.form);
                    this.$http.post("user/job/editJob", editData).then(res => {
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

    .el-alert{
        padding: 0 16px;
    }

    .wid50 {
        width: 50%;
        display: inline-block;
    }
</style>