/**
* 描述:编辑文章
*
**/
<template>
    <div class="editArticle tui-wh100">
        <el-form ref="form" label-width="6em">
            <el-form-item label="文章标题" class="is-required wid50">
                <el-input v-model="form.title" maxlength="100" show-word-limit v-validate
                          data-rules="required" validate-name="title" validate-type="keyup"
                          validate-tips-required="请输入文章标题"></el-input>
                <el-alert v-if="errors.get('title')!=null" :title="errors.get('title')" type="error"/>
            </el-form-item>
            <el-form-item label="文章类型" class="is-required wid50">
                <el-cascader v-model="form.typeid" :options="types" :props="{leaf: 'children_cnt',checkStrictly:true,emitPath:false}" v-validate
                             data-rules="required" validate-name="typeid" validate-type="change"
                             validate-tips-required="请输入文章类型"></el-cascader>
                <el-alert v-if="errors.get('typeid')!=null" :title="errors.get('typeid')" type="error"/>
            </el-form-item>
            <t-editor v-model="form.content"/>
        </el-form>
        <span slot="footer" class="dialog-footer">
                <el-button @click="showCurrentDialog = false">取 消</el-button>
                <el-button type="success" @click="onSubmit(1)">暂 存</el-button>
                <el-button type="success" @click="onSubmit(2)">保 存</el-button>
                <el-button type="primary" @click="onSubmit(3)">发 布</el-button>
        </span>
    </div>
</template>

<script>
    import TEditor from "../../components/tEditor/tEditor";

    export default {
        name: "editArticle",
        components: {TEditor},
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
                    title: '',
                    typeid: '',
                    typeid_text: '',
                    content: '',
                    status: 1,
                },//表单数据
                types: [],
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
            this.form = Object.assign(this.form, this.editData);
            this.getPTreeByPid().then(res => {
                let deep = (arr) => {
                    arr.forEach(item => {
                        item['label']=item['name'];
                        item['value']=item['id'];
                        item['leaf']= Number(item['children_cnt']) <= 0;
                        if(!item['leaf']){
                            deep(item['children'])
                        }
                    });

                };
                deep(res);
                this.types = res;
            });
        },
        methods: {
            //获取类型
            getPTreeByPid() {
                let param = {};
                return new Promise(resolve => {
                    this.$http.post('article/articleType/getListByPid', param).then(res => {
                        let data = res['data'];
                        resolve(data);
                    });
                });
            },
            //提交
            onSubmit(status) {
                if (this.$validator.checkAll()) {
                    this.form.status = status;
                    let editData = Object.assign({}, this.form);
                    this.$http.post("article/article/edit", editData).then(res => {
                        if (res['data']['isSuccess']) {
                            this.showCurrentDialog = false;
                            this.$message({
                                message: res['msg'],
                                type: 'success'
                            });
                            this.$emit("reloadData", this.form['pid']);
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
        margin-top: 20px;
    }

    .el-alert {
        padding: 0 16px;
    }

    .el-cascader {
        width: 100%;
    }

    .wid50 {
        width: 50%;
        display: inline-block;
    }
</style>