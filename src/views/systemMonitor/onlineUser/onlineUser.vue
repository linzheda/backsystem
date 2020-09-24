<template>
    <div class="onlineUser tui-wh100">
        <!--查询-->
        <div class="search" v-if="showSearch">
            <el-form ref="form" label-width="80px">
                <el-form-item label="用户名称:">
                    <el-input placeholder="请输入用户名称" prefix-icon="el-icon-search" clearable
                              v-model="filter.name"></el-input>
                </el-form-item>
                <el-form-item label="登录名:">
                    <el-input placeholder="请输入登录名" prefix-icon="el-icon-search" clearable
                              v-model="filter.loginname"></el-input>
                </el-form-item>
                <el-form-item label="电话号码:">
                    <el-input placeholder="请输入电话号码" prefix-icon="el-icon-search" clearable
                              v-model="filter.tel"></el-input>
                </el-form-item>
                <el-form-item label="标签">
                    <el-select style="width: 100%"
                               v-model="filter.tag"
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
                <el-form-item label-width="10px">
                    <el-button type="primary" icon="el-icon-search" round @click="getData('current',1)">搜索
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <!--表格-->
        <div class="content" :style="{'height':showSearch?'calc(100% - 90px)':'calc(100% - 15px)'}">
            <div class="do-box">
                <div class="tui-left">
                    <el-button type="danger" @click="handleLoginout()" v-has="'loginout'">
                        <svg-icon icon-class="loginout"></svg-icon>
                        强退
                    </el-button>
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
                                <!--性别-->
                                <template v-if="item.prop=='sex_text'">
                                    <svg-icon icon-class="woman" class="tui-sex-color-woman"
                                              v-if="scope.row.sex_text=='女'"></svg-icon>
                                    <svg-icon icon-class="man" class="tui-sex-color-man"
                                              v-if="scope.row.sex_text=='男'"></svg-icon>
                                </template>
                            </template>
                        </el-table-column>
                    </template>
                    <el-table-column label="操作" :width="btnCnt*60" align="center" fixed="right" v-if="btnCnt>0">
                        <template slot-scope="scope">
                            <el-tooltip content="强退" placement="top">
                                <el-button size="mini" circle type="danger"
                                           @click="handleLoginout(scope.row)" v-has="'loginout'">
                                    <svg-icon icon-class="loginout"></svg-icon>
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
    </div>
</template>

<script>
    export default {
        name: "onlineUser",
        data() {
            return {
                showSearch: true,//是否显示搜索框
                filter: {},//过滤参数
                dataPage: {
                    sizes: [100, 200, 300, 400],
                    size: 100,
                    current: 1,
                    total: 0,
                    records: []
                },//表格分页数据
                showColumns: [
                    {label: '序号', prop: 'id', fixed: 'left', align: 'center', width: 80, isShow: true},
                    {label: '用户名', prop: 'name', fixed: 'left', align: 'center', width: 150, isShow: true},
                    {label: '登录名', prop: 'loginname', width: 150, align: 'center', isShow: true},
                    {label: '电话', prop: 'tel', width: 150, align: 'center', isShow: true},
                    {label: '状态', prop: 'status_text', width: 80, isScope: true, align: 'center', isShow: true},
                    {label: '组织', prop: 'orgid_text', width: 180, align: 'center', isShow: true},
                    {label: '岗位', prop: 'jobid_text', width: 100, align: 'center', isShow: false},
                    {label: '身份证', prop: 'idcard', width: 300, align: 'center', isShow: false},
                    {label: '性别', prop: 'sex_text', width: 80, isScope: true, align: 'center', isShow: true},
                    {label: '地址', prop: 'address', isShow: true},
                    {label: '标签', prop: 'tag_text', isShow: true},
                    {label: '邮箱', prop: 'email', width: 300, align: 'center', isShow: false},
                ],//显示的列
                tags: [],//人员标签
                btnCnt: 0,//拥有的操作个数
            }
        },
        created() {
            this.btnCnt = this.$permissions.hasCnt('loginout', this.$route.meta);
            this.getData();
            this.getTags();
        },
        mounted() {
        },
        methods: {
            //获取人员标签
            getTags() {
                this.$http.post('pub/pubCtr/getDict', {key: 'user_tag'}).then(res => {
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
                this.$http.post("user/user/getOnlineUserList", param).then(res => {
                    this.dataPage = Object.assign(this.dataPage, res.data);
                });
            },
            //表格重新布局
            changeColumns() {
                this.$nextTick(() => {
                    this.$refs.table.doLayout();
                });
            },
            //点击强退
            handleLoginout(data) {
                if (this.$utils.isEmpty(data)) {//说明是点击表格上方的编辑
                    data = this.$refs.table.store.states.currentRow;
                    if (this.$utils.isEmpty(data)) {
                        this.$message.warning("请选择一行数据");
                    } else {
                        this.logout(data['id']);
                    }
                } else {//说明点击的是表格内的编辑
                    this.logout(data['id']);
                }
            },
            //强退
            logout(userid) {
                this.$confirm('您确定要强行退出这个用户吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let param = {
                        userid: userid
                    };
                    this.$http.post("user/user/loginOutById", param).then(res => {
                        console.log(res);
                        this.getData("current", 1);
                    });
                });
            }

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