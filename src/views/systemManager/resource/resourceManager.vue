<template>
    <div class="resource">
        <div class="search" v-if="showSearch">
            <el-form ref="form" label-width="80px">
                <el-form-item label="菜单名称:">
                    <el-input
                            placeholder="请输入菜单名称"
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
        <div class="content">
            <div class="do-box">
                <div class="tui-left">
                    <el-button type="primary" icon="el-icon-plus" @click="handleAdd()">新增</el-button>
                    <el-button type="primary" icon="el-icon-edit" @click="handleEdit()">修改</el-button>
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
                    <el-table-column prop="name" label="菜单名称" width="300" v-if="isShowColumn('name')"></el-table-column>
                    <el-table-column prop="type_text" label="类型" width="80" align="center"
                                     v-if="isShowColumn('type_text')"></el-table-column>
                    <el-table-column prop="route" label="路由" v-if="isShowColumn('route')"></el-table-column>
                    <el-table-column prop="rank" sortable label="等级" width="80" align="center"
                                     v-if="isShowColumn('rank')"></el-table-column>
                    <el-table-column prop="seq" sortable label="排序" width="80" align="center"
                                     v-if="isShowColumn('seq')"></el-table-column>
                    <el-table-column label="图标" width="80" align="center" v-if="isShowColumn('icon')">
                        <template slot-scope="scope">
                            <svg-icon v-if="scope.row.icon!=null" :icon-class="scope.row.icon"></svg-icon>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="180" align="center">
                        <template slot-scope="scope">
                            <el-button
                                    size="mini"
                                    @click="handleEdit(scope.row)">编辑
                            </el-button>
                            <el-button
                                    size="mini"
                                    type="danger"
                                    @click="handleDelete(scope.row)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!--弹窗-->
        <el-dialog v-el-drag-dialog
                   v-if="showEditDialog"
                   :append-to-body="true"
                   title="编辑菜单"
                   :visible.sync="showEditDialog"
                   width="40%">
            <edit-resource :showDialog.sync=showEditDialog @reloadData="loadData($event)"
                           :editData="editData"></edit-resource>
        </el-dialog>
    </div>
</template>

<script>
    import EditResource from "./editResource";
    import elDragDialog from '@/directives/el-drag-dialog';

    export default {
        name: "resourceManager",
        directives: {elDragDialog},
        components: {EditResource},
        data() {
            return {
                filter: {
                    name: '',//菜单名称
                },//查询条件
                data: [],//列表数据
                showEditDialog: false,//是否显示编辑面板
                editData: {},//被选中编辑的数据
                isOpen: false,//展开与折叠状态 默认折叠
                showColumns: [
                    {label: '菜单名称', prop: 'name', isShow: true},
                    {label: '类型', prop: 'type_text', isShow: true},
                    {label: '路由', prop: 'route', isShow: true},
                    {label: '等级', prop: 'rank', isShow: true},
                    {label: '排序', prop: 'seq', isShow: true},
                    {label: '图标', prop: 'icon', isShow: true},
                ],//显示的列
                showSearch: true,//是否显示查询栏
            }
        },
        created() {
            this.getResourcesByPid(0).then(data => {
                this.$nextTick(() => {
                    this.data = data;
                });
            });
        },
        methods: {
            //是否显示表格列
            isShowColumn(prop) {
                let temp = this.showColumns.find(item => {
                    return item.prop == prop;
                });
                return temp['isShow'] || false;
            },
            //获取菜单数据
            getResourcesByPid(pid) {
                return new Promise(resolve => {
                    let param = {
                        pid: pid
                    };
                    param = Object.assign(param, this.filter);
                    this.$http.post('user/resources/getResourcesByPid', param).then(res => {
                        let data = res['data'];
                        data.forEach(item => {
                            if (item['children_cnt'] > 0) {
                                item['hasChildren'] = true;
                            } else {
                                item['hasChildren'] = false;
                            }
                        })
                        resolve(data);
                    });
                })
            },
            //载入  懒加载用
            load(tree, treeNode, resolve) {
                this.getResourcesByPid(tree['id']).then(data => {
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
                    this.$http.post('user/resources/delResources', {id: data['id']}).then(res => {
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
                this.getResourcesByPid(pid).then(data => {
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
    .resource {
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
        height: calc(100% - 80px);

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
