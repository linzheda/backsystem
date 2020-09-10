<template>
    <div class="editRole">
        <el-form ref="form" label-width="6em">
            <el-form-item label="角色名称" class="is-required">
                <el-input v-model="form.name" v-validate
                          data-rules="required" validate-name="name" validate-type="keyup"
                          validate-tips-required="请输入角色名称"></el-input>
                <el-alert v-if="errors.get('name')!=null" :title="errors.get('name')" type="error"/>
            </el-form-item>
            <el-form-item label="角色编码" class="is-required" >
                <el-input v-model="form.code" v-validate
                          data-rules="required" validate-name="code" validate-type="keyup"
                          validate-tips-required="请输入角色编码"></el-input>
                <el-alert v-if="errors.get('code')!=null" :title="errors.get('code')" type="error"/>
            </el-form-item>
            <el-form-item label="状态" class="wid50 is-required">
                <el-radio-group v-model="form.status">
                    <el-radio :label="1">启用</el-radio>
                    <el-radio :label="0">禁用</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="显示排序" class="wid50">
                <el-input type="number" v-model="form.seq"></el-input>
            </el-form-item>
            <el-form-item label="标签">
                <el-select style="width: 100%"
                           v-model="form.tag"
                           multiple
                           filterable
                           allow-create
                           default-first-option
                           placeholder="请选择角色标签">
                    <el-option
                            v-for="item in tags"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="描述">
                <el-input type="textarea" v-model="form.description"></el-input>
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
        name: "editRole",
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
                    tag:'',
                    description:'',
                    status:1,
                    seq:null,
                },//表单数据
                showCurrentDialog: this.showDialog,//是否显示选择当前的dialog
                tags:[],//标签
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
            this.form['tag'] = this.$utils.isNotEmpty(this.form['tag'])?this.form['tag'].split(","):this.form['tag'];
            this.getTags();
        },
        mounted() {
        },
        methods: {
            //获取角色标签
            getTags(){
                this.$http.post('/pub/pubCtr/getDict',{key:'role_tag'}).then(res=>{
                    this.tags = res.data;
                })
            },
            //提交
            onSubmit(){
                if(this.$validator.checkAll()){
                    let editData = Object.assign({}, this.form);
                    this.$http.post("user/role/editRole", editData).then(res => {
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