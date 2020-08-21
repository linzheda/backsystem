
<template>
    <div class="clientManager tui-wh100">
        <div class="search" v-if="showSearch">
            <el-form ref="form" label-width="80px">
                <el-form-item label="应用名称:">
                    <el-input placeholder="请输入应用名称" prefix-icon="el-icon-search" clearable
                              v-model="filter.name"></el-input>
                </el-form-item>
                <el-form-item label="编码:">
                    <el-input placeholder="请输入应用编码" prefix-icon="el-icon-search" clearable
                              v-model="filter.code"></el-input>
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
                    <el-button type="primary" icon="el-icon-edit"  @click="handleEdit()" v-has="'edit'">修改</el-button>
                </div>
                <div class="tui-right">
                    <el-button icon="el-icon-search" @click="showSearch=!showSearch"></el-button>
                    <el-button icon="el-icon-refresh" @click="getData('current',1)"></el-button>
                    <el-popover class="right-columns"
                                placement="bottom"
                                width="80"
                                trigger="click">
                        <div class="columns-checkbox">
                            <el-checkbox v-for="item of showColumns" @change="changeColumns" :key="item.prop" v-model="item.isShow">
                                {{item.label}}
                            </el-checkbox>
                        </div>
                        <el-button slot="reference" icon="el-icon-tickets"></el-button>
                    </el-popover>
                </div>
            </div>
            <div class="table" style="height: calc(100% - 50px)">
                <el-table :data="dataPage.records" row-key="id" highlight-current-row  height=" calc(100% - 20px)" ref="table">
                    <template v-for="item of showColumns">
                        <el-table-column :key="item.prop" v-if="item.isShow"
                                         :prop="item.prop" :label="item.label"
                                         :sortable="item.sortable" :fixed="item.fixed"
                                         :width="item.width" :align="item.align"></el-table-column>
                    </template>
                    <el-table-column label="操作" width="240" align="center" fixed="right">
                        <template slot-scope="scope">
                            <el-button size="mini"
                                       @click="handleEdit(scope.row)"  v-has="'edit'">编辑
                            </el-button>
                            <el-button size="mini" type="danger"
                                       @click="handleDelete(scope.row)"  v-has="'delete'">删除
                            </el-button>
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
        <el-dialog v-el-drag-dialog
                   v-if="showEditDialog"
                   :append-to-body="true"
                   title="编辑应用"
                   :visible.sync="showEditDialog"
                   width="40%">
            <edit-client :showDialog.sync=showEditDialog @reloadData="getData('current',dataPage.current)"
                         :editData="editData"></edit-client>
        </el-dialog>
    </div>
</template>

<script>
    import elDragDialog from '@/directives/el-drag-dialog';
    import EditClient from "./editClient";
    export default {
        name: "clientManager",
        directives: {elDragDialog},
        components: {EditClient},
        data() {
            return {
                filter: {},//查询条件
                data: [],//列表数据
                showEditDialog: false,//是否显示编辑面板
                editData: {},//被选中编辑的数据
                showColumns: [
                    {label: '名称', prop: 'name', width: 180, isShow: true},
                    {label: '编码', prop: 'code', align: 'center', width: 150, isShow: true},
                    {label: '标识', prop: 'client_id', align: 'center', width: 300, isShow: true},
                    {label: '秘钥', prop: 'client_secret', align: 'center', width: 300, isShow: true},
                    {label: '描述', prop: 'description',  align: 'center',  isShow: true},
                    {label: '标签', prop: 'tag', width: 80,isShow: true},
                ],//显示的列
                showSearch: true,//是否显示查询栏
                dataPage: {
                    sizes: [100, 200, 300, 400],
                    size: 100,
                    current: 1,
                    total: 0,
                    records: []
                },//表格分页数据
            }
        },
        created() {
            this.getData();
        },
        mounted() {
        },
        methods: {
            //获取系统参数列表数据 分页
            getData(type, val) {
                this.dataPage[type] = val;
                let param = {
                    current: this.dataPage.current,
                    size: this.dataPage.size,
                };
                param = Object.assign(param, this.filter);
                this.$http.post("/docking/thirdPartyDocking/getThirdPartyDockingList", param).then(res => {
                    this.dataPage = Object.assign(this.dataPage, res.data);
                });
            },
            //表格重新布局
            changeColumns(){
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
                    this.$http.post('/docking/thirdPartyDocking/delThirdPartyDocking', {id: data['id']}).then(res => {
                        if (res['data']) {
                            this.$message({
                                message: res['msg'] || '删除成功',
                                type: 'success'
                            });
                            this.getData('current',this.dataPage.current);
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
        }
    }
</script>

<style scoped lang="scss">
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

    .columns-checkbox {
        .el-checkbox {
            display: block;
        }

    }
</style>