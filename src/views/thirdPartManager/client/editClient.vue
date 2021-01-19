<template>
    <div class="editClient tui-wh100">
        <el-form ref="form" label-width="6em">
            <el-form-item label="应用名称" class="is-required">
                <el-input v-model="form.name" v-validate
                          data-rules="required" validate-name="name" validate-type="keyup"
                          validate-tips-required="请输入应用名称"></el-input>
                <el-alert v-if="errors.get('name')!=null" :title="errors.get('name')" type="error"/>
            </el-form-item>
            <el-form-item label="应用编码" class="is-required" >
                <el-input v-model="form.code" v-validate
                          data-rules="required" validate-name="code" validate-type="keyup"
                          validate-tips-required="请输入应用编码"></el-input>
                <el-alert v-if="errors.get('code')!=null" :title="errors.get('code')" type="error"/>
            </el-form-item>
            <el-form-item label="标签" class="is-required" >
                <el-input v-model="form.tag" v-validate
                          data-rules="required" validate-name="tag" validate-type="keyup"
                          validate-tips-required="请输入应用标签"></el-input>
                <el-alert v-if="errors.get('tag')!=null" :title="errors.get('tag')" type="error"/>
            </el-form-item>
            <el-form-item label="参数">
                <el-input v-model="form.attr" ></el-input>
            </el-form-item>
            <el-form-item label="描述">
               <el-input type="textarea" :autosize="{ minRows: 2}"  v-model="form.description"></el-input>
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
        name: "editClient",
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
                    attr:'',
                    description:''
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
                    this.$http.post("docking/thirdPartyDocking/editThirdPartyDocking", editData).then(res => {
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