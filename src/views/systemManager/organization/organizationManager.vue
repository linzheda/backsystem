<template>
    <div class="organizationManager">
        <div class="search" v-if="showSearch">
            <el-form ref="form" label-width="80px">
                <el-form-item label="机构名称:">
                    <el-input
                            placeholder="请输入机构名称"
                            prefix-icon="el-icon-search"
                            clearable
                            v-model="filter.name">
                    </el-input>
                </el-form-item>
                <el-form-item label-width="10px">
                    <el-button type="primary" icon="el-icon-search" round @click="loadData(null)">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!--表格-->
        <div class="content" :style="{'height':showSearch?'calc(100% - 90px)':'calc(100% - 15px)'}">
            <div class="do-box">
                <div class="tui-left">
                    <el-button type="primary" icon="el-icon-plus" @click="handleAdd()" v-has="'add'">新增</el-button>
                    <el-button type="primary" icon="el-icon-edit"  @click="handleEdit()" v-has="'edit'">修改</el-button>
                    <el-button type="primary" icon="el-icon-sort" @click="toggleRowExpansion()">展开/折叠</el-button>
                </div>
                <div class="tui-right">
                    <el-button icon="el-icon-search" @click="showSearch=!showSearch"></el-button>
                    <el-button icon="el-icon-refresh" @click="loadData(0,true)"></el-button>
                    <el-popover class="right-columns"
                                placement="bottom"
                                width="80"
                                trigger="click">
                        <div class="columns-checkbox">
                            <el-checkbox v-for="item of showColumns" :key="item.prop" v-model="item.isShow">
                                {{item.label}}
                            </el-checkbox>
                        </div>
                        <el-button slot="reference" icon="el-icon-tickets"></el-button>
                    </el-popover>
                </div>
            </div>
            <div class="table" style="height: calc(100% - 50px)">
                <el-table :data="data" row-key="id" lazy :load="load"
                          highlight-current-row ref="treeTable"
                          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                          style="width: 100%" border height="100%">
                    <template v-for="item of showColumns">
                        <el-table-column :key="item.prop" v-if="item.isShow&&item.isScope!=true"
                                         :prop="item.prop" :label="item.label"
                                         :sortable="item.sortable" :fixed="item.fixed"
                                         :width="item.width" :align="item.align"></el-table-column>
                    </template>
                    <el-table-column label="操作" :width="btnCnt*60" align="center" fixed="right" v-if="btnCnt>0">
                        <template slot-scope="scope">
                            <el-tooltip  content="编辑" placement="top">
                                <el-button class="el-icon-edit" circle type="primary" size="mini"
                                        @click="handleEdit(scope.row)"  v-has="'edit'">
                                </el-button>
                            </el-tooltip>
                            <el-tooltip  content="删除" placement="top">
                                <el-button  circle type="danger" class="el-icon-delete" size="mini"
                                        @click="handleDelete(scope.row)"  v-has="'delete'">
                                </el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!--弹窗-->
        <el-dialog v-el-drag-dialog
                   v-if="showEditDialog"
                   :append-to-body="true"
                   title="编辑组织机构"
                   :visible.sync="showEditDialog"
                   width="40%">
            <edit-organization :showDialog.sync=showEditDialog @reloadData="loadData($event)"
                               :editData="editData"></edit-organization>
        </el-dialog>
    </div>
</template>

<script>
    import EditOrganization from "./editOrganization";
    import elDragDialog from '@/directives/el-drag-dialog';
    export default {
        name: "organizationManager",
        directives: {elDragDialog},
        components: {EditOrganization},
        data() {
            return {
                filter: {},//查询条件
                data: [],//列表数据
                showEditDialog: false,//是否显示编辑面板
                editData: {},//被选中编辑的数据
                isOpen: false,//展开与折叠状态 默认折叠
                showColumns: [
                    {label: '机构名称', prop: 'name',width:300, isShow: true},
                    {label: '机构代码', prop: 'code', align:'center',width:80, isShow: true},
                    {label: '描述', prop: 'description', isShow: true},
                    {label: '等级', prop: 'level', align:'center',sortable:'sortable', width:80,isShow: true},
                    {label: '排序', prop: 'seq', align:'center', sortable:'sortable',width:80,isShow: true},
                ],//显示的列
                showSearch: true,//是否显示查询栏
                btnCnt: 0,//拥有的操作个数
            }
        },
        created() {
            this.btnCnt = this.$permissions.hasCnt('edit||delete', this.$route.meta);
            this.getTeeDataByPid(0).then(data => {
                this.$nextTick(() => {
                    this.data = data;
                });
            });
        },
        mounted() {
        },
        methods: {
            //获取菜单数据
            getTeeDataByPid(pid) {
                return new Promise(resolve => {
                    let param = {
                        pid: pid
                    };
                    param = Object.assign(param, this.filter);
                    this.$http.post('user/organization/getOrganizationByPid', param).then(res => {
                        let data = res['data'];
                        data.forEach(item => {
                            item['hasChildren']=item['children_cnt'] > 0?true:false;
                        })
                        resolve(data);
                    });
                })
            },
            //载入  懒加载用
            load(tree, treeNode, resolve) {
                this.getTeeDataByPid(tree['id']).then(data => {
                    let result = data;
                    this.appendData(this.data, tree['id'], result);
                    resolve(result)
                });
            },
            //装载子节点
            appendData(arr, pid, result) {
                for (let item of arr) {
                    if (item['id'] == pid) {
                        item['children'] = result;
                        break;
                    }
                    if (item['hasChildren'] && item['children'] != null && item['children'].length > 0) {
                        this.appendData(item['children'], pid, result);
                    }
                }
            },
            //点击编辑
            handleEdit(data) {
                if (this.$utils.isEmpty(data)) {//说明是点击表格上方的编辑
                    data = this.$refs.treeTable.store.states.currentRow;
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
                    this.$http.post('user/organization/delOrganization', {id: data['id']}).then(res => {
                        if (res['data']) {
                            this.$message({
                                message: res['msg'] || '删除成功',
                                type: 'success'
                            });
                            this.loadData(data['pid']);
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
            //重新加载数据
            loadData(pid = 0, isReset = false) {
                this.getTeeDataByPid(pid).then(data => {
                    if (pid == 0 || pid == null || isReset) {
                        this.data.splice(0, this.data.length);
                        for (let key in this.$refs.treeTable.store.states.lazyTreeNodeMap) {
                            this.$delete(this.$refs.treeTable.store.states.lazyTreeNodeMap, key);
                        }
                        this.data = data;
                    }
                    this.$set(this.$refs.treeTable.store.states.lazyTreeNodeMap, pid, data);
                });

            },
            //展开折叠
            toggleRowExpansion() {
                this.isOpen = !this.isOpen;
                this.toggleRowExpansionForAll(this.data, this.isOpen);
            },
            toggleRowExpansionForAll(data, flag) {
                data.forEach(item => {
                    this.$refs.treeTable.toggleRowExpansion(item, flag);
                    if (item['hasChildren']) {
                        if (item['children'] != null && item['children'].length > 0) {
                            this.toggleRowExpansionForAll(item.children, flag);
                        } else {
                            //todo:这里点击
                            console.log(this.$refs.treeTable)
                        }
                    }
                });
            },
        }
    }
</script>

<style scoped lang="scss">
    .organizationManager{
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
            table thead .el-table tr {
                background-color: #EFF3F8;
            }
        }

    }

    .columns-checkbox {
        .el-checkbox {
            display: block;
        }

    }

</style>