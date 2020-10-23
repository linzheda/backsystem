<template>
    <div class="interfaceLog tui-wh100">
        <div class="search" v-if="showSearch">
            <el-form ref="form" label-width="80px">
                <el-form-item label="系统模块:">
                    <el-input placeholder="请输入系统模块" prefix-icon="el-icon-search" clearable
                              v-model="filter.module"></el-input>
                </el-form-item>
                <el-form-item label="请求应用:">
                    <el-select v-model="filter.client_id" placeholder="请选择请求应用">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="item in clients"
                                   :key="item.client_id"
                                   :label="item.name"
                                   :value="item.client_id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="操作类型:">
                    <el-select v-model="filter.opertype" placeholder="请选择操作类型">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="item in opertype"
                                   :key="item.value"
                                   :label="item.name"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="操作时间">
                    <el-date-picker
                            v-model="filter.opertime"
                            type="datetimerange"
                            :picker-options="pickerOptions"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            align="right">
                    </el-date-picker>
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
                    <el-button type="danger" icon="el-icon-delete" @click="handleClean()" v-has="'clean'">清空</el-button>
                </div>
                <div class="tui-right">
                    <el-button icon="el-icon-search" @click="showSearch=!showSearch"></el-button>
                    <el-button icon="el-icon-refresh" @click="getData('current',1)"></el-button>
                    <el-popover class="right-columns"
                                placement="bottom"
                                width="80"
                                trigger="click">
                        <div class="columns-checkbox">
                            <el-checkbox v-for="item of showColumns" @change="changeColumns" :key="item.prop"
                                         v-model="item.isShow">
                                {{item.label}}
                            </el-checkbox>
                        </div>
                        <el-button slot="reference" icon="el-icon-tickets"></el-button>
                    </el-popover>
                </div>
            </div>
            <div class="table" style="height: calc(100% - 50px)">
                <el-table :data="dataPage.records" row-key="id" highlight-current-row height=" calc(100% - 20px)"
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
                                <!--操作类型-->
                                <template v-if="item.prop=='opertype_text'">
                                    <el-tag :class="'tui-opertype-'+scope.row.opertype">
                                        {{scope.row.opertype_text}}
                                    </el-tag>
                                </template>
                            </template>
                        </el-table-column>
                    </template>
                    <el-table-column label="操作" :width="btnCnt*60" align="center" fixed="right" v-if="btnCnt>0">
                        <template slot-scope="scope">
                            <el-tooltip content="详情" placement="top">
                                <el-button class="el-icon-search" circle type="primary" size="mini"
                                           @click="handleDetail(scope.row)" v-has="'detail'">
                                </el-button>
                            </el-tooltip>
                            <el-tooltip content="删除" placement="top">
                                <el-button class="el-icon-delete" circle type="danger" size="mini"
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
        <el-dialog v-el-drag-dialog
                   v-if="showDetailDialog"
                   :append-to-body="true"
                   title="查看日志详情"
                   :visible.sync="showDetailDialog"
                   width="40%">
            <log-detail :showDialog.sync="showDetailDialog" :editData="editData"></log-detail>
        </el-dialog>
    </div>
</template>

<script>
    import elDragDialog from '@/directives/el-drag-dialog';
    import LogDetail from "./logDetail";
    export default {
        name: "interfaceLog",
        components: {LogDetail},
        directives: {elDragDialog},
        data() {
            return {
                filter: {},//查询条件
                data: [],//列表数据
                showDetailDialog: false,//是否显示编辑面板
                editData: {},//被选中编辑的数据
                showColumns: [
                    {label: '系统模块', prop: 'module', width: 180, align: 'center', isShow: true},
                    {label: '操作描述', prop: 'operdesc', align: 'center', width: 180, isShow: true},
                    {label: '操作类型', prop: 'opertype_text',isScope:true, width: 80, align: 'center', isShow: true},
                    {label: '请求应用', prop: 'client_id_text', width: 100, align: 'center', isShow: true},
                    {label: '请求地址', prop: 'requrl', align: 'center', isShow: true},
                    {label: '操作状态', prop: 'status_text',isScope:true, width: 80, align: 'center', isShow: true},
                    {label: 'IP地址', prop: 'ipaddr', align: 'center', width: 180,isShow: true},
                    {label: '操作时间', prop: 'createtime', sortable: 'sortable', align: 'center', width: 200, isShow: true},
                ],//显示的列
                showSearch: true,//是否显示查询栏
                dataPage: {
                    sizes: [50,100, 200, 300, 400],
                    size: 50,
                    current: 1,
                    total: 0,
                    records: []
                },//表格分页数据
                opertype: [],//操作类型
                clients: [],//应用集合
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },//日期选择的快捷选项
                btnCnt: 0,//拥有的操作个数
                logtype:'interface',//日志类型
            }
        },
        created() {
            this.getOperType();
            this.getClientList();
            this.getData();
            this.btnCnt = this.$permissions.hasCnt('detail||delete', this.$route.meta);
        },
        mounted() {
        },
        methods: {
            //获取操作类型
            getOperType() {
                this.$http.post('pub/pubCtr/getDict', {key: 'oper_type'}).then(res => {
                    this.opertype = res.data;
                });
            },
            //获取应用集合
            getClientList(){
                let params={
                    current:1,
                    size:100,
                };
                this.$http.post('docking/thirdPartyDocking/getThirdPartyDockingList', params).then(res => {
                    this.clients = res.data['records'];
                });
            },
            //获取列表数据 分页
            getData(type, val) {
                this.dataPage[type] = val;
                let param = {
                    current: this.dataPage.current,
                    size: this.dataPage.size,
                    type:this.logtype,
                };
                param = Object.assign(param, this.filter);
                this.$http.post("syslog/sysLog/getLogList", param).then(res => {
                    this.dataPage = Object.assign(this.dataPage, res.data);
                });
            },
            //表格重新布局
            changeColumns() {
                this.$nextTick(() => {
                    this.$refs.table.doLayout();
                });
            },
            //点击查看详情
            handleDetail(data) {
                this.editData = data;
                this.showDetailDialog = true;
            },
            //点击删除
            handleDelete(data) {
                this.$confirm('您确定要删除这条记录吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.post('syslog/sysLog/delLog', {id: data['id']}).then(res => {
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
            //点击清空
            handleClean() {
                this.$confirm('您确定要清空所有的记录吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.post('syslog/sysLog/cleanLog', {type:this.logtype}).then(res => {
                        if (res['data']) {
                            this.$message({
                                message: res['msg'] || '成功清空',
                                type: 'success'
                            });
                            this.getData('current', this.dataPage.current);
                        } else {
                            this.$message.error(res['msg'] || '操作失败');
                        }
                    });
                });

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