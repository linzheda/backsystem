<template>
    <div class="interfaceManager tui-wh100">
        <!--查询-->
        <div class="search" v-if="showSearch">
            <el-form ref="form" label-width="80px">
                <el-form-item label="接口名称:">
                    <el-input placeholder="请输入接口名称" prefix-icon="el-icon-search" clearable
                              v-model="filter.name"></el-input>
                </el-form-item>
                <el-form-item label="接口地址:">
                    <el-input placeholder="请输入接口地址" prefix-icon="el-icon-search" clearable
                              v-model="filter.url"></el-input>
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
                <el-table :data="dataPage.records" row-key="id"  border highlight-current-row  height=" calc(100% - 20px)" ref="table">
                    <template v-for="item of showColumns">
                        <el-table-column :key="item.prop" v-if="item.isShow"
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
                            <el-tooltip  content="调用日志" placement="top">
                                <el-button  circle type="primary" class="el-icon-notebook-1" size="mini"
                                            @click="handleLog(scope.row)"  v-has="'log'">
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
                   v-if="showAddDialog"
                   :append-to-body="true"
                   title="新增接口"
                   :visible.sync="showAddDialog"
                   width="40%">
            <add-interface  :showDialog.sync=showAddDialog @reloadData="getData('current',dataPage.current)"></add-interface>
        </el-dialog>
        <el-dialog v-el-drag-dialog
                   v-if="showEditDialog"
                   :append-to-body="true"
                   title="编辑接口"
                   :visible.sync="showEditDialog"
                   width="40%">
            <edit-interface :showDialog.sync=showEditDialog @reloadData="getData('current',dataPage.current)"
                            :editData="editData"></edit-interface>
        </el-dialog>
        <el-dialog v-el-drag-dialog
                   v-if="showLogDialog"
                   :append-to-body="true"
                   title="调用日志"
                   :visible.sync="showLogDialog"
                   width="40%">
            <log-timeline :showDialog.sync=showLogDialog :paramData="editData"></log-timeline>
        </el-dialog>
    </div>
</template>

<script>
    import elDragDialog from '@/directives/el-drag-dialog';
    import LogTimeline from "../../systemMonitor/logMonitor/logTimeline";
    import AddInterface from "./addInterface";
    import EditInterface from "./editInterface";
    export default {
        name: "interfaceManager",
        directives: {elDragDialog},
        components: {EditInterface, AddInterface, LogTimeline},
        data() {
            return {
                filter: {},//查询条件
                data: [],//列表数据
                editData: {},//被选中编辑的数据
                showEditDialog: false,//是否显示编辑面板
                showAddDialog: false,//是否显示编辑面板
                showLogDialog: false,//是否显示日志面板
                showColumns: [
                    {label: '接口名称', prop: 'name', width: 200, isShow: true},
                    {label: '接口地址', prop: 'url', align: 'left',  isShow: true},
                    {label: '访问路径', prop: 'path', align: 'left',  isShow: true},
                    {label: '方法', prop: 'method', align: 'center',width: 200,  isShow: true},
                    {label: '请求类型', prop: 'type', align: 'center', width: 80,  isShow: true},
                    {label: '状态', prop: 'status_text', align: 'center', width: 80, isShow: true},
                    {label: '备注', prop: 'remark',  align: 'center',  isShow: false},
                    {label: '创建时间', prop: 'createtime',  align: 'center',width: 150,  isShow: false},
                ],//显示的列
                showSearch: true,//是否显示查询栏
                dataPage: {
                    sizes: [50,100, 200, 300, 400],
                    size: 50,
                    current: 1,
                    total: 0,
                    records: []
                },//表格分页数据
                btnCnt: 0,//拥有的操作个数
            }
        },
        created() {
            this.btnCnt=this.$permissions.hasCnt(this.$route.meta);
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
                this.$http.post("dockinginterface/manager/getInterfaceList", param).then(res => {
                    this.dataPage = Object.assign(this.dataPage, res.data);
                });
            },
            //表格重新布局
            changeColumns(){
                this.$nextTick(() => {
                    this.$refs.table.doLayout();
                });
            }, //点击编辑
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
                    this.$http.post('dockinginterface/manager/delInterface', {id: data['id']}).then(res => {
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
            //点击调用日志
            handleLog(data){
                this.showLogDialog = true;
                this.editData ={
                    url:data['url']
                };
            },
            //点击新增
            async handleAdd() {
                this.showAddDialog = true;
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