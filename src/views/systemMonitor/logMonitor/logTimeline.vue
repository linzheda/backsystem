<template>
    <div class="logTimeline tui-wh100">
        <el-dialog v-el-drag-dialog
                   v-if="showDetailDialog"
                   :append-to-body="true"
                   title="日志详情"
                   :visible.sync="showDetailDialog"
                   width="40%">
            <log-detail :showDialog.sync="showDetailDialog" :editData="editData"></log-detail>
        </el-dialog>


        <div class="timeline-box">
            <el-timeline v-infinite-scroll="load" infinite-scroll-disabled="disabled">
                <el-timeline-item v-for="(item,index) in timelineData " :key="index" :timestamp="item.createtime"
                                  placement="top">
                    <el-card>
                        <h4>{{item.module}}=>{{item.operdesc}}
                            <el-tag :type="item.status===1?'success':'danger'" effect="dark">{{item.status_text}}
                            </el-tag>
                        </h4>
                        <p v-if="type===1">
                            {{item.operatorid_text}}于{{item.createtime}}操作
                            <el-tooltip content="查看详细日志" placement="top">
                                <el-button type="primary" icon="el-icon-search" circle size="mini"
                                           @click="handleLogDetail(item)"></el-button>
                            </el-tooltip>
                        </p>
                        <p v-if="type===2">
                            {{item.client_id_text}}(ip地址:{{item.ipaddr}})于{{item.createtime}} 调用
                            <el-tooltip content="查看详细日志" placement="top">
                                <el-button type="primary" icon="el-icon-search" circle size="mini"
                                           @click="handleLogDetail(item)"></el-button>
                            </el-tooltip>
                        </p>
                        <p v-if="type===3">
                            {{item.client_id_text!=null?item.client_id_text:item.operatorid_text}}
                            (ip地址:{{item.ipaddr}})于{{item.createtime}} 调用
                            <el-tooltip content="查看详细日志" placement="top">
                                <el-button type="primary" icon="el-icon-search" circle size="mini"
                                           @click="handleLogDetail(item)"></el-button>
                            </el-tooltip>
                        </p>
                    </el-card>

                </el-timeline-item>
            </el-timeline>
            <p v-if="loading">
                <el-divider><i class="el-icon-loading"></i>&nbsp;&nbsp;&nbsp;加载中...</el-divider>
            </p>
            <p v-if="noMore&&timelineData.length>0">
                <el-divider>我也是有底线的</el-divider>
            </p>
            <p v-if="timelineData.length==0">
                <el-divider>暂无数据</el-divider>
            </p>
        </div>
        <span slot="footer" class="dialog-footer">
                <el-button @click="showCurrentDialog = false">关 闭</el-button>
        </span>
    </div>
</template>

<script>
    import elDragDialog from '@/directives/el-drag-dialog';
    import LogDetail from "./logDetail";

    export default {
        name: "logTimeline",
        components: {LogDetail},
        directives: {elDragDialog},
        props: {
            showDialog: Boolean,//是否显示dialog
            paramData: {
                type: Object,
                default: null
            }
        },
        data() {
            return {
                filter: {},//过滤条件
                editData: {},//数据
                type: 1,//类型 1用户id 2应用id client_id
                showCurrentDialog: this.showDialog,//是否显示选择当前的dialog
                dataPage: {
                    sizes: [20, 100, 200, 300, 400],
                    size: 20,
                    current: 1,
                    total: 0,
                    records: []
                },//分页数据
                timelineData: [],//时间线的数据
                loading: false,//加载中
                showDetailDialog: false,//查看日志详情

            }
        },
        computed: {
            noMore() {
                return this.dataPage.current === this.dataPage['pages'] || this.dataPage['pages'] === '0';
            },
            disabled() {
                return this.loading || this.noMore
            }
        },
        watch: {
            showCurrentDialog(value) {
                if (value === false) {
                    this.$emit("update:showDialog", false);
                }
            },
        },
        created() {
            if (this.$utils.isNotEmpty(this.paramData['client_id'])) {
                this.type = 2;
            }
            if (this.$utils.isNotEmpty(this.paramData['url'])) {
                this.type = 3;
            }
        },
        mounted() {
        },
        methods: {
            //获取日志的时间线
            getLogTimeLine(type, val) {
                this.dataPage[type] = val;
                let param = {
                    current: this.dataPage.current,
                    size: this.dataPage.size,
                    type: this.logtype,
                };
                if (this.type == 1) {
                    param['userid'] = this.paramData['userid'];
                } else if (this.type == 2) {
                    param['client_id'] = this.paramData['client_id'];
                } else if (this.type == 3) {
                    param['url'] = this.paramData['url'];
                }
                param = Object.assign(param, this.filter);
                return new Promise(resolve => {
                    this.$http.post("syslog/sysLog/getLogTimeLine", param).then(res => {
                        this.dataPage = Object.assign(this.dataPage, res.data);
                        resolve(res.data['records']);
                    });
                });
            },
            //载入
            load() {
                this.loading = true
                this.getLogTimeLine('current', Number(this.dataPage.current) + 1).then((data) => {
                    this.timelineData = this.timelineData.concat(data);
                    this.loading = false
                });
            },
            //点击查看详情
            handleLogDetail(data) {
                this.editData = data;
                this.showDetailDialog = true;
            },
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

    .timeline-box {
        height: 500px;
        overflow-y: scroll;

        .el-tag {
            margin-left: 10px;
            padding: 0 2px;
            line-height: 16px;
            height: 18px;
        }
    }

    .wid50 {
        width: 50%;
        display: inline-block;
    }
</style>