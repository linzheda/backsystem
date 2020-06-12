<template>
    <div class="resource">
        <div class="search">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="菜单名称:">
                    <el-input
                            placeholder="请输入内容"
                            prefix-icon="el-icon-search"
                            clearable
                            v-model="form.name">
                    </el-input>
                </el-form-item>
                <el-form-item label-width="10px">
                    <el-button type="primary" icon="el-icon-search" round>搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="content">
            <div class="do-box">
                <div class="tui-left">
                    <el-button type="primary" icon="el-icon-plus">新增</el-button>
                    <el-button type="success" icon="el-icon-edit">修改</el-button>
                </div>
                <div class="right"></div>
            </div>
            <div class="table" style="height: calc(100% - 50px)">
                <el-table :data="data" row-key="id" lazy :load="load"
                          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                          style="width: 100%" border height="100%">
                    <el-table-column prop="name" label="菜单名称" width="300"></el-table-column>
                    <el-table-column prop="type_text" label="类型" width="80" align="center"></el-table-column>
                    <el-table-column prop="route" label="路由"></el-table-column>
                    <el-table-column prop="seq" label="排序" width="80" align="center"></el-table-column>
                    <el-table-column label="图标" width="80" align="center">
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
        <el-dialog
                v-if="showEditDialog"
                :append-to-body="true"
                title="编辑菜单"
                :visible.sync="showEditDialog"
                width="40%">
            <edit-resource @showDialog="showEditDialog=false" :editData="editData"></edit-resource>
        </el-dialog>
    </div>
</template>

<script>
    import EditResource from "./editResource";

    export default {
        name: "resourceManager",
        components: {EditResource},
        data() {
            return {
                form: {
                    name: '',//菜单名称
                },//查询条件
                data: [],//列表数据
                showEditDialog: false,//是否显示编辑面板
                editData: {},//被选中编辑的数据
            }
        },
        created() {
            this.getResourcesByPid(0).then(data => {
                this.data = data;
            });
        },
        methods: {
            //获取菜单数据
            getResourcesByPid(pid) {
                return new Promise(resolve => {
                    let param = {
                        pid: pid
                    };
                    this.$http.post('/user/resources/getResourcesByPid', param).then(res => {
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
                let result;
                this.getResourcesByPid(tree['id']).then(data => {
                    result = data;
                })
                setTimeout(() => {
                    resolve(result)
                }, 1000)
            },
            //点击编辑
            handleEdit(data) {
                this.showEditDialog = true;
                this.editData = data;
            },
            //点击删除
            handleDelete(data) {
                console.log(data);
            }
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
        }

        .table {
            table thead .el-table tr {
                background-color: #EFF3F8;
            }
        }

    }
</style>
