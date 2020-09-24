<template>
    <div class="editUser">
        <!--选择组织机构-->
        <el-dialog v-el-drag-dialog
                   v-if="showOrgDialog"
                   :append-to-body="true"
                   title="选择组织机构"
                   :visible.sync="showOrgDialog"
                   width="20%">
            <el-input placeholder="输入关键字进行过滤" prefix-icon="el-icon-search" v-model="filterText"></el-input>
            <el-tree :props="{children: 'children',label: 'name',isLeaf: 'leaf'}"
                     check-strictly
                     ref="tree"
                     show-checkbox
                     :default-checked-keys="[form['orgid']]"
                     node-key="id"
                     @check-change="treeRadio"
                     :load="loadNode"
                     :filter-node-method="filterNode"
                     lazy></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showOrgDialog = false">取 消</el-button>
                <el-button type="primary" @click="changeOrgid">确 定</el-button>
        </span>
        </el-dialog>
        <!--选择岗位-->
        <el-dialog v-el-drag-dialog
                   v-if="showJobDialog"
                   :append-to-body="true"
                   title="选择岗位"
                   :visible.sync="showJobDialog"
                   width="40%">
            <div class="table" style="height: 300px">
                <el-input  placeholder="请输入岗位名称" prefix-icon="el-icon-search" clearable
                           v-model="filter.name" ></el-input>
                <el-button  type="primary" icon="el-icon-search"  @click="getData('current',1)">搜索</el-button>

                <el-table :data="dataPage.records" row-key="id" highlight-current-row  height=" calc(100% - 25px)" ref="table">
                    <template v-for="item of showColumns">
                        <el-table-column :key="item.prop" v-if="item.isShow"
                                         :prop="item.prop" :label="item.label"
                                         :sortable="item.sortable" :fixed="item.fixed"
                                         :width="item.width" :align="item.align"></el-table-column>
                    </template>
                </el-table>
                <el-pagination
                        @size-change="getData('size',$event)"
                        @current-change="getData('current',$event)"
                        :current-page="Number(dataPage.current)"
                        :page-sizes="dataPage.sizes"
                        :page-size="Number(dataPage.size)"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="Number(dataPage.total)">
                </el-pagination>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setCurrent(null);">清空选中</el-button>
                <el-button type="primary" @click="changeJobid">确 定</el-button>
             </span>
        </el-dialog>
        <!--表单-->
        <el-form ref="form" label-width="6em">
            <el-form-item label="用户名" class="wid50 is-required">
                <el-input v-model="form.name" v-validate
                          data-rules="required" validate-name="name" validate-type="keyup"
                          validate-tips-required="请输入用户名"></el-input>
                <el-alert v-if="errors.get('name')!=null" :title="errors.get('name')" type="error"/>
            </el-form-item>
            <el-form-item label="登录账号" class="wid50 is-required">
                <el-input v-model="form.loginname"></el-input>
            </el-form-item>
            <el-form-item label="状态" class="wid50 is-required">
                <el-radio-group v-model="form.status">
                    <el-radio :label="1">启用</el-radio>
                    <el-radio :label="0">禁用</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="手机号" class="wid50">
                <el-input v-model="form.tel"></el-input>
            </el-form-item>
            <el-form-item label="组织机构" class="wid50">
                <el-input :disabled="true" @click.native="showOrgDialog=true" suffix-icon="el-icon-search"
                          v-model="form.orgid_text"></el-input>
            </el-form-item>
            <el-form-item label="岗位" class="wid50">
                <el-input :disabled="true" @click.native="showJobDialog=true;getData('current',1)" suffix-icon="el-icon-search"
                          v-model="form.jobid_text"></el-input>
            </el-form-item>
            <el-form-item label="标签">
                <el-select style="width: 100%"
                           v-model="form.tag"
                           multiple
                           filterable
                           allow-create
                           default-first-option
                           placeholder="请选择用户标签">
                    <el-option
                            v-for="item in tags"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="身份证" class="wid50">
                <el-input v-model="form.idcard"></el-input>
            </el-form-item>
            <el-form-item label="性别" class="wid50">
                <el-radio-group v-model="form.sex">
                    <el-radio :label="1">男</el-radio>
                    <el-radio :label="2">女</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="地址" class="wid50">
                <el-input v-model="form.address"></el-input>
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
    import elDragDialog from '@/directives/el-drag-dialog';

    export default {
        name: "editUser",
        directives: {elDragDialog},
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
                    id: null,
                    name: '',
                    loginname: '',
                    status: 1,
                    tel: '',
                    idcard: '',
                    orgid: '',
                    orgid_text: '',
                    jobid: '',
                    jobid_text: '',
                    sex: 1,
                    email: '',
                    address: '',
                    seq: null,
                    tag:'',
                    remark: ''
                },//表单数据
                showCurrentDialog: this.showDialog,//是否显示选择当前的dialog
                showOrgDialog: false,//是否显示选择组织机构的面板
                showJobDialog: false,//是否显示选择岗位的面板
                filterText:'',//树形数据过滤关键字
                dataPage: {
                    sizes: [100, 200, 300, 400],
                    size: 100,
                    current: 1,
                    total: 0,
                    records: []
                },//表格分页数据
                showColumns: [
                    {label: '名称', prop: 'name', width: 150, isShow: true},
                    {label: '编码', prop: 'code', align: 'center', width: 100, isShow: true},
                    {label: '状态', prop: 'status_text', width: 80,isShow: true},
                    {label: '描述', prop: 'description',  align: 'center',  isShow: true},
                    {label: '排序', prop: 'seq', sortable: 'sortable', align: 'center', width: 80, isShow: false},
                ],//显示的列
                filter:{},//岗位过滤条件
                tags:[],//人员标签
            }
        },
        watch: {
            showCurrentDialog(value) {
                if (value === false) {
                    this.$emit("update:showDialog", false);
                }
            },
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        created() {
            this.form = Object.assign(this.form, this.editData);
            this.form['tag'] = this.$utils.isNotEmpty(this.form['tag'])?this.form['tag'].split(","):this.form['tag'];
            this.getTags();
        },
        mounted() {
        },
        methods: {
            //获取人员标签
            getTags(){
                this.$http.post('pub/pubCtr/getDict',{key:'user_tag'}).then(res=>{
                    this.tags = res.data;
                })
            },
            //根据组织机构获取数据
            getTreeByPid(pid) {
                let param = {
                    pid: pid,
                };
                return new Promise(resolve => {
                    this.$http.post('user/organization/getOrganizationByPid', param).then(res => {
                        let data = res['data'];
                        data.forEach(item => {
                            item['leaf'] = item['children_cnt'] > 0 ? false : true;
                            item['label'] = item['name'];
                        });
                        resolve(data);
                    });
                });
            },
            //过滤方法
            filterNode(value,data){
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
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
                if (node != null) {//说明有选择
                    this.form['orgid'] = node[0]['id'];
                    this.form['orgid_text'] = node[0]['name'];
                } else {
                    this.form['orgid'] = '';
                    this.form['orgid_text'] = null;
                }
                this.showOrgDialog = false;
            },
            //获取系统参数列表数据 分页
            getData(type, val) {
                this.dataPage[type] = val;
                let param = {
                    current: this.dataPage.current,
                    size: this.dataPage.size,
                };
                param = Object.assign(param, this.filter);
                this.$http.post("user/job/getJobList", param).then(res => {
                    this.dataPage = Object.assign(this.dataPage, res.data);
                });
            },
            //表格重新布局
            changeColumns(){
                this.$nextTick(() => {
                    this.$refs.table.doLayout();
                });
            },
            //取消选中
            setCurrent(row) {
                this.$refs.table.setCurrentRow(row);
            },
            //点击修改 岗位id
            changeJobid(){
                let job = this.$refs.table.store.states.currentRow;
                if (job != null) {//说明有选择
                    this.form['jobid'] = job['id'];
                    this.form['jobid_text'] = job['name'];
                }else{
                    this.form['jobid'] = null;
                    this.form['jobid_text'] = '';
                }
                this.showJobDialog = false;
            },
            //提交
            onSubmit() {
                if (this.$validator.checkAll()) {
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

    .el-alert {
        padding: 0 16px;
    }

    .wid50 {
        width: 50%;
        display: inline-block;
    }

    .table{
        .el-input{
            width: 80%;
        }
    }
</style>