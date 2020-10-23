<template>
    <div class="roleManager">
        <!--查询块-->
        <div class="search" v-if="showSearch">
            <el-form ref="form" label-width="80px">
                <el-form-item label="角色名称:">
                    <el-input placeholder="请输入角色名称" prefix-icon="el-icon-search" clearable
                              v-model="filter.name"></el-input>
                </el-form-item>
                <el-form-item label="角色编码:">
                    <el-input placeholder="请输入角色编码" prefix-icon="el-icon-search" clearable
                              v-model="filter.code"></el-input>
                </el-form-item>
                <el-form-item label="标签" style="width: 400px;">
                    <el-select style="width: 100%"
                               v-model="filter.tag"
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
                <el-form-item label-width="10px">
                    <el-button type="primary" icon="el-icon-search" round @click="getData('current',1)">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!--内容-->
        <div class="content" :style="{'height':showSearch?'calc(100% - 90px)':'calc(100% - 15px)'}">
            <div class="do-box">
                <div class="tui-left">
                    <el-button type="primary" icon="el-icon-plus" @click="handleAdd()" v-has="'add'">新增</el-button>
                    <el-button type="primary" icon="el-icon-edit" @click="handleEdit()" v-has="'edit'">修改</el-button>
                </div>
                <div class="tui-right">
                    <el-button icon="el-icon-search" @click="showSearch=!showSearch"></el-button>
                    <el-button icon="el-icon-refresh" @click="getData('current',1)"></el-button>
                    <el-popover class="right-columns"
                                placement="bottom"
                                width="80"
                                trigger="click">
                        <div class="columns-checkbox">
                            <el-checkbox v-for="item of showColumns" :key="item.prop" @change="changeColumns"
                                         v-model="item.isShow">
                                {{item.label}}
                            </el-checkbox>
                        </div>
                        <el-button slot="reference" icon="el-icon-tickets"></el-button>
                    </el-popover>
                </div>
            </div>
            <div class="table" style="height: calc(100% - 50px)">
                <el-table :data="dataPage.records" row-key="id" highlight-current-row height="calc(100% - 20px)"
                          ref="table">
                    <template v-for="item of showColumns">
                        <el-table-column :key="item.prop" v-if="item.isShow&&item.isScope!=true"
                                         :prop="item.prop" :label="item.label"
                                         :sortable="item.sortable" :fixed="item.fixed"
                                         :width="item.width" :align="item.align"></el-table-column>
                        <el-table-column v-else-if="item.isShow&&item.isScope" :key="item.prop"
                                         :label="item.label" :align="item.align" :width="item.width">
                            <template slot-scope="scope">
                                <!--状态-->
                                <template v-if="item.prop=='status_text'">
                                    <el-tag :class="'tui-status-'+scope.row.status">
                                        {{scope.row.status_text}}
                                    </el-tag>
                                </template>
                            </template>
                        </el-table-column>
                    </template>
                    <el-table-column label="操作" :width="btnCnt*60" align="center" fixed="right" v-if="btnCnt>0">
                        <template slot-scope="scope">
                            <el-tooltip content="编辑" placement="top">
                                <el-button size="mini" circle type="primary" class="el-icon-edit"
                                           @click="handleEdit(scope.row)" v-has="'edit'">
                                </el-button>
                            </el-tooltip>
                            <el-tooltip content="分配菜单" placement="top">
                                <el-button size="mini" circle type="primary" class="el-icon-menu"
                                           @click="handleResources(scope.row)" v-has="'awardresources'">
                                </el-button>
                            </el-tooltip>
                            <el-tooltip content="分配用户" placement="top">
                                <el-button size="mini" circle type="primary" class="el-icon-user-solid"
                                           @click="handleUser(scope.row)" v-has="'awarduser'">
                                </el-button>
                            </el-tooltip>
                            <el-tooltip content="删除" placement="top">
                                <el-button size="mini" circle type="danger" class="el-icon-delete"
                                           @click="handleDelete(scope.row)" v-has="'delete'">
                                </el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
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
        </div>
        <!--弹窗-->
        <!--编辑角色-->
        <el-dialog v-el-drag-dialog
                   v-if="showEditDialog"
                   :append-to-body="true"
                   title="编辑角色"
                   :visible.sync="showEditDialog"
                   width="35%">
            <edit-role :showDialog.sync=showEditDialog @reloadData="getData('current',dataPage.current)"
                       :editData="editData"></edit-role>
        </el-dialog>
        <!--分配菜单-->
        <el-dialog v-el-drag-dialog
                   v-if="showResourcesDialog"
                   :append-to-body="true"
                   title="分配菜单资源"
                   :visible.sync="showResourcesDialog"
                   width="20%">
            <edit-role-resources :showDialog.sync=showResourcesDialog
                                 :editData="editData"></edit-role-resources>
        </el-dialog>
        <!--分配用户-->
        <el-dialog v-el-drag-dialog
                   v-if="showUserDialog"
                   :append-to-body="true"
                   title="分配用户"
                   :visible.sync="showUserDialog"
                   width="75%">
            <edit-role-user :showDialog.sync=showUserDialog
                            :editData="editData"></edit-role-user>
        </el-dialog>

    </div>

</template>

<script>
    import elDragDialog from '@/directives/el-drag-dialog';
    import EditRole from "./editRole";
    import EditRoleResources from "./editRoleResources";
    import EditRoleUser from "./editRoleUser";

    export default {
        name: "roleManager",
        components: {EditRoleUser, EditRoleResources, EditRole},
        directives: {elDragDialog},
        data() {
            return {
                filter: {},//过滤条件
                showSearch: true,//是否显示查询框
                dataPage: {
                    sizes: [50,100, 200, 300, 400],
                    size: 50,
                    current: 1,
                    total: 0,
                    records: []
                },//表格分页数据
                showColumns: [
                    {label: '序号', prop: 'id', fixed: 'left', align: 'center', width: 80, isShow: false},
                    {label: '角色名称', prop: 'name', fixed: 'left', align: 'center', width: 150, isShow: true},
                    {label: '角色编码', prop: 'code', width: 150, align: 'center', isShow: true},
                    {label: '角色描述', prop: 'description', isShow: true},
                    {label: '角色标签', prop: 'tag_text', isShow: true},
                    {label: '状态', prop: 'status_text', width: 80, isScope: true, align: 'center', isShow: true},
                    {label: '排序', prop: 'seq', width: 80, align: 'center', isShow: false},
                ],//显示的列
                showEditDialog: false,//是否显示编辑面板
                showResourcesDialog: false,//是否显示编辑菜单资源面板
                showUserDialog: false,//是否显示编辑用户资源面板
                editData: {},//被选中编辑的数据
                tags: [],//角色标签
                btnCnt: 0,//拥有的操作个数
            }
        },
        created() {
            this.btnCnt = this.$permissions.hasCnt('edit||delete||awardresources||awarduser', this.$route.meta);
            this.getData();
            this.getTags();
        },
        mounted() {

        },
        methods: {
            //获取角色标签
            getTags() {
                this.$http.post('pub/pubCtr/getDict', {key: 'role_tag'}).then(res => {
                    this.tags = res.data;
                })
            },
            //获取用户列表数据 分页
            getData(type, val) {
                this.dataPage[type] = val;
                let param = {
                    current: this.dataPage.current,
                    size: this.dataPage.size,
                };
                param = Object.assign(param, this.filter);
                this.$http.post("user/role/getRoleList", param).then(res => {
                    this.dataPage = Object.assign(this.dataPage, res.data);
                });
            },
            //表格重新布局
            changeColumns() {
                this.$nextTick(() => {
                    this.$refs.table.doLayout();
                });
            },
            //点击编辑
            handleEdit(data) {
                if (this.$utils.isEmpty(data)) {//说明是点击表格上方的编辑
                    data = this.$refs.table.store.states.currentRow;
                    if (this.$utils.isEmpty(data)) {
                        this.$message.warning("请选择一行数据");
                    } else {
                        this.showEditDialog = true;
                        this.editData = data;
                    }
                } else {//说明点击的是表格内的编辑
                    this.showEditDialog = true;
                    this.editData = data;
                }
            },
            //点击删除
            handleDelete(data) {
                this.$confirm('您确定要删除这条记录吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.post('user/role/delRole', {id: data['id']}).then(res => {
                        if (res['data']) {
                            this.$message({
                                message: res['msg'] || '删除成功',
                                type: 'success'
                            });
                            this.getData('current', this.dataPage.current);
                        } else {
                            this.$message.error(res['msg'] || '删除失败');
                        }
                    });
                });

            },
            //点击新增
            handleAdd() {
                this.editData = {};
                this.showEditDialog = true;
            },
            //点击分配菜单
            handleResources(data) {
                if (this.$utils.isEmpty(data)) {//说明是点击表格上方的编辑
                    data = this.$refs.table.store.states.currentRow;
                    if (this.$utils.isEmpty(data)) {
                        this.$message.warning("请选择一行数据");
                    } else {
                        this.showResourcesDialog = true;
                        this.editData = data;
                    }
                } else {//说明点击的是表格内的编辑
                    this.showResourcesDialog = true;
                    this.editData = data;
                }
            },
            //点击分配用户
            handleUser(data) {
                if (this.$utils.isEmpty(data)) {//说明是点击表格上方的编辑
                    data = this.$refs.table.store.states.currentRow;
                    if (this.$utils.isEmpty(data)) {
                        this.$message.warning("请选择一行数据");
                    } else {
                        this.showUserDialog = true;
                        this.editData = data;
                    }
                } else {//说明点击的是表格内的编辑
                    this.showUserDialog = true;
                    this.editData = data;
                }
            },
        }
    }
</script>

<style scoped lang="scss">
    .roleManager {
        height: 100%;
    }

    //搜索
    .search {
        background: white;
        height: 45px;
        border-radius: 10px;
        padding: 10px 20px;
        margin-bottom: 10px;

        .el-form-item {
            float: left;
            margin-bottom: 10px;
        }
    }

    //内容
    .content {
        background: white;
        border-radius: 10px;
        padding: 10px 20px;
        height: calc(100% - 90px);

        .do-box {
            height: 50px;

            .tui-right .el-button {
                margin-left: 0;
            }
        }

        .table {
            width: 100%;

            .el-table {
                height: calc(100% - 20px);
            }

            .el-pagination {
                float: right;
                margin-right: 20px;
            }
        }

    }

    //自定义 表格列
    .columns-checkbox {
        .el-checkbox {
            display: block;
        }

    }

</style>
