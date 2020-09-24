<template>
    <div class="sysparamManager tui-wh100">
        <div class="search" v-if="showSearch">
            <el-form ref="form" label-width="80px">
                <el-form-item label="参数名称:">
                    <el-input placeholder="请输入参数名称" prefix-icon="el-icon-search" clearable
                              v-model="filter.name"></el-input>
                </el-form-item>
                <el-form-item label="编码:">
                    <el-input placeholder="请输入参数编码" prefix-icon="el-icon-search" clearable
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
                            <el-tooltip  content="编辑" placement="top">
                                <el-button class="el-icon-edit" circle type="primary" size="mini"
                                           @click="handleEdit(scope.row)"  v-has="'edit'">
                                </el-button>
                            </el-tooltip>
                            <el-tooltip  content="删除" placement="top">
                                <el-button circle type="danger" class="el-icon-delete" size="mini"
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
                   v-if="showEditDialog"
                   :append-to-body="true"
                   title="编辑系统参数"
                   :visible.sync="showEditDialog"
                   width="40%">
            <edit-sysparam :showDialog.sync=showEditDialog @reloadData="getData('current',dataPage.current)"
                           :editData="editData"></edit-sysparam>
        </el-dialog>
    </div>
</template>

<script>
    import elDragDialog from '@/directives/el-drag-dialog';
    import EditSysparam from "./editSysparam";
    export default {
        name: "sysparamManager",
        components: {EditSysparam},
        directives: {elDragDialog},
        data() {
            return {
                filter: {},//查询条件
                data: [],//列表数据
                showEditDialog: false,//是否显示编辑面板
                editData: {},//被选中编辑的数据
                isOpen: false,//展开与折叠状态 默认折叠
                showColumns: [
                    {label: '参数名称', prop: 'name', width: 180, isShow: true},
                    {label: '参数编码', prop: 'code', align: 'center', width: 150, isShow: true},
                    {label: '参数值', prop: 'value', align: 'center', width: 150, isShow: true},
                    {label: '状态', prop: 'status_text',isScope: true, width: 80,isShow: true},
                    {label: '描述', prop: 'description',  align: 'center',  isShow: true},
                    {label: '排序', prop: 'seq', sortable: 'sortable', align: 'center', width: 80, isShow: true},
                ],//显示的列
                showSearch: true,//是否显示查询栏
                dataPage: {
                    sizes: [100, 200, 300, 400],
                    size: 100,
                    current: 1,
                    total: 0,
                    records: []
                },//表格分页数据
                btnCnt: 0,//拥有的操作个数
            }
        },
        created() {
            this.btnCnt = this.$permissions.hasCnt('edit||delete', this.$route.meta);
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
                this.$http.post("sysparam/sysparam/getSysParamList", param).then(res => {
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
                    this.$http.post('sysparam/sysparam/delSysparam', {id: data['id']}).then(res => {
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