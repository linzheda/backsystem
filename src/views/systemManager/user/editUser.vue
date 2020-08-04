<template>
    <div class="editUser">
        <!--选择组织机构-->
        <el-dialog v-el-drag-dialog
                   v-if="showOrgDialog"
                   :append-to-body="true"
                   title="选择组织机构"
                   :visible.sync="showOrgDialog"
                   width="20%">
            <el-tree :props="{children: 'children',label: 'name',isLeaf: 'leaf'}"
                     check-strictly
                     ref="tree"
                     show-checkbox
                     default-expand-all
                     node-key="id"
                     @check-change="treeRadio"
                     :load="loadNode"
                     lazy></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showOrgDialog = false">取 消</el-button>
                <el-button type="primary" @click="changePid">确 定</el-button>
        </span>
        </el-dialog>
        <!--表单-->
        <el-form ref="form" label-width="6em">
            <el-form-item label="用户名" class="wid50 is-required" >
                <el-input v-model="form.name" v-validate
                          data-rules="required" validate-name="name" validate-type="keyup"
                          validate-tips-required="请输入用户名"></el-input>
                <el-alert v-if="errors.get('name')!=null" :title="errors.get('name')" type="error"/>
            </el-form-item>
            <el-form-item label="登录账号" class="wid50 is-required" >
                <el-input v-model="form.loginname"></el-input>
            </el-form-item>
            <el-form-item label="组织机构" class="wid50">
                <el-input v-model="form.orgid_text"></el-input>
            </el-form-item>
            <el-form-item label="岗位" class="wid50">
                <el-input v-model="form.jobid_text"></el-input>
            </el-form-item>
            <el-form-item label="身份证" class="wid50">
                <el-input v-model="form.idcard"></el-input>
            </el-form-item>
            <el-form-item label="性别" class="wid50">
                <el-input v-model="form.sex"></el-input>
            </el-form-item>
            <el-form-item label="地址" class="wid50">
                <el-input v-model="form.tel"></el-input>
            </el-form-item>
            <el-form-item label="手机号" class="wid50">
                <el-input v-model="form.tel"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" class="wid50">
                <el-input v-model="form.email"></el-input>
            </el-form-item>
            <el-form-item label="显示排序" class="wid50">
                <el-input type="number" v-model="form.seq"></el-input>
            </el-form-item>
            <el-form-item label="备注">
                <el-input type="textarea" v-model="form.remark"></el-input>
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
        name: "editUser",
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
                showOrgDialog: false,//是否显示选择组织机构的面板
                showJobDialog: false,//是否显示选择岗位的面板
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
            //根据组织机构获取数据
            getTreeByPid(pid) {
                let param = {
                    pid: pid,
                };
                return new Promise(resolve => {
                    this.$http.post('/user/organization/getOrganizationByPid', param).then(res => {
                        let data = res['data'];
                        data.forEach(item => {
                            item['leaf'] = item['children_cnt'] > 0 ? false : true;
                            item['label'] = item['name'];
                        });
                        resolve(data);
                    });
                });
            },
            //菜单树加载
            loadNode(node, resolve) {
                let pid = this.$utils.isNotEmpty(node['data']) ? node['data']['id'] : 0;
                this.getTreeByPid(pid).then(res => {
                    resolve(res);
                });
            },
            //菜单树单选控制
            treeRadio(data, checked) {
                if (checked) {
                    this.$refs.tree.setCheckedNodes([data]);
                }
            },
            //点击确认 修改组织机构id
            changeOrgid() {
                let node = this.$refs.tree.getCheckedNodes();
                if(node!=null){//说明有选择
                    this.form['orgid'] = node[0]['id'];
                    this.form['orgid_text'] = node[0]['name'];
                }else{
                    this.form['pid_text'] = '';
                    this.form['pid'] =null;
                }
                this.showPidDialog=false;
            },
            //提交
            onSubmit() {
                if(this.$validator.checkAll()){
                    let editData = Object.assign({}, this.form);
                    this.$http.post("user/user/editUser", editData).then(res => {
                        if (res['data']['isSuccess']) {
                            this.showCurrentDialog = false;
                            this.$message({
                                message: res['msg'],
                                type: 'success'
                            });
                            this.$emit("reloadData", 1);
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