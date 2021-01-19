<template>
    <div class="articleListManager tui-wh100">
        <!--文章类型-->
        <div class="box-left" :style="{flex:isOpenLeftDiv?'0.16':'0'}">
            <div class="content" v-show="isOpenLeftDiv">
                <div class="header">
                    <h3>文章类型
                        <span class="do-icon">
                        <i :class="{'el-icon-arrow-up':isOpenLeftTree==false,'el-icon-arrow-down':isOpenLeftTree}"
                           @click="allExpand"></i>
                        <i class="el-icon-refresh"></i>
                    </span>
                    </h3>
                </div>
                <div class="tree">
                    <el-input placeholder="输入关键字进行过滤" prefix-icon="el-icon-search" v-model="filterText"></el-input>
                    <el-scrollbar class="data">
                        <el-tree :props="{children: 'children',label: 'name',isLeaf: 'leaf'}"
                                 check-strictly
                                 ref="tree"
                                 show-checkbox
                                 node-key="id"
                                 @check-change="leftCheckChange"
                                 :load="loadNode"
                                 :filter-node-method="filterNode"
                                 lazy></el-tree>
                    </el-scrollbar>

                </div>
            </div>

            <div class="open-close">
                <i :class="{'el-icon-caret-left':isOpenLeftDiv,'el-icon-caret-right':isOpenLeftDiv==false}"
                   @click="isOpenLeftDiv=!isOpenLeftDiv"></i>
            </div>
        </div>
        <!--文章列表-->
        <div class="box-right">
            <div class="header" v-if="showSearch">
                <el-form ref="form" label-width="80px">
                    <el-form-item label="文章标题:">
                        <el-input placeholder="请输入文章标题" prefix-icon="el-icon-search" clearable
                                  v-model="filter.title"></el-input>
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
                        <el-button type="primary" icon="el-icon-plus" @click="handleAdd()" v-has="'add'">新增</el-button>
                        <el-button type="primary" icon="el-icon-edit" @click="handleEdit()" v-has="'edit'">修改
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
                                        <el-tag :class="'tui-article-status-'+scope.row.status">
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
        </div>
        <!--弹窗 编辑文章-->
        <el-dialog v-el-drag-dialog
                   v-if="showEditDialog"
                   :append-to-body="true"
                   title="编辑文章"
                   :visible.sync="showEditDialog"
                   width="80%">
            <edit-article  :showDialog.sync=showEditDialog @reloadData="getData('current',dataPage.current)"
                           :editData="editData" />
        </el-dialog>
    </div>
</template>

<script>
    import elDragDialog from '@/directives/el-drag-dialog';
    import EditArticle from "./editArticle";
    export default {
        name: "articleListManager",
        directives: {elDragDialog},
        components: {EditArticle},
        data() {
            return {
                isOpenLeftTree: true,//是否展开左侧树形菜单
                isOpenLeftDiv: true,//展开收起左侧的面板
                leftTreeData: [],//左侧的树形菜单
                showSearch: true,//是否显示搜索框
                filter: {},//过滤参数
                dataPage: {
                    sizes: [50,100, 200, 300, 400],
                    size: 50,
                    current: 1,
                    total: 0,
                    records: []
                },//表格分页数据
                showColumns: [
                    {label: '序号', prop: 'id', fixed: 'left', align: 'center', width: 80, isShow: true},
                    {label: '标题', prop: 'title', fixed: 'left', align: 'center',  isShow: true},
                    {label: '类型名称', prop: 'typeid_text', width: 150, align: 'center', isShow: true},
                    {label: '状态', prop: 'status_text', width: 80, isScope: true, align: 'center', isShow: true},
                    {label: '创建人', prop: 'createby_text', width: 150, align: 'center', isShow: true},
                    {label: '创建时间', prop: 'createtime', width: 150, align: 'center', isShow: true},
                ],//显示的列
                showEditDialog: false,//是否显示编辑面板
                editData: {},//被选中编辑的数据
                filterText: '',//树形数据过滤关键字
                tags: [],//人员标签
                btnCnt: 0,//拥有的操作个数
            }
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        created() {
            this.btnCnt = this.$permissions.hasCnt(this.$route.meta);
        },
        mounted() {
            this.getData();
        },
        methods: {
            //根据pid获取数据
            getTreeByPid(pid) {
                let param = {
                    pid: pid,
                };
                return new Promise(resolve => {
                    this.$http.post('article/articleType/getListByPid', param).then(res => {
                        let data = res['data'];
                        data.forEach(item => {
                            item['leaf'] = item['children_cnt'] > 0 ? false : true;
                            item['label'] = item['name'];
                        });
                        resolve(data);
                    });
                });
            },
            //菜单树加载
            loadNode(node, resolve) {
                let pid = this.$utils.isNotEmpty(node['data']) ? node['data']['id'] : 0;
                this.getTreeByPid(pid).then(res => {
                    resolve(res);
                });
            },
            //过滤方法
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            //左侧数勾选=变化
            leftCheckChange(data, checked) {
                let arr = this.$utils.isNotEmpty(this.filter['typeid']) ? this.filter['typeid'].split(',') : [];
                if (checked) {
                    arr.push(data['id']);
                } else {
                    let index = arr.findIndex(item => {
                        return data['id'] == item;
                    });
                    arr.splice(index, 1);
                }
                this.filter['typeid'] = arr.join(',');
                this.getData('current', 1);
            },
            //展开收起树
            allExpand() {
                this.isOpenLeftTree = !this.isOpenLeftTree;
                let isExpand = this.isOpenLeftTree;
                for (let key in this.$refs.tree.store.nodesMap) {
                    this.$refs.tree.store.nodesMap[key].expanded = isExpand;
                }
            },
            //获取用户列表数据 分页
            getData(type, val) {
                this.dataPage[type] = val;
                let param = {
                    current: this.dataPage.current,
                    size: this.dataPage.size,
                };
                param = Object.assign(param, this.filter);
                this.$http.post("article/article/getList", param).then(res => {
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
            //点击新增
            handleAdd() {
                this.editData = {};
                this.showEditDialog = true;
            },
            //点击删除
            handleDelete(data) {
                this.$confirm('您确定要删除这条记录吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.post('article/article/delById', {id: data['id']}).then(res => {
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
        }
    }
</script>

<style scoped lang="scss">
    .articleListManager{
        display: flex;

        .box-left {
            background: white;
            flex: 2;
            display: flex;
            border-radius: 5px;

            .content {
                flex: 2;

                .header {
                    text-align: center;

                    .do-icon {
                        float: right;
                        margin-right: 30px;

                        i {
                            padding: 0 5px;
                        }
                    }
                }

                .tree {
                    height: calc(100% - 50px);

                    .data {
                        height: calc(100% - 80px);
                        overflow-y: auto;
                    }

                    .el-input {
                        width: calc(100% - 20px);
                        margin: 5px 10px;
                    }
                }
            }

            .open-close {
                flex: 0.01;
                display: flex;
                justify-content: center;
                align-items: center;

                i {
                    font-size: 12px;
                    background: #d0d2d5;
                    line-height: 40px;
                }
            }
        }

        .box-right {
            flex: 1;
            width: 0;
            margin-left: 10px;
            padding: 0 2px;

            .header {
                text-align: center;
                background: white;
                width: auto;
                height: 45px;
                border-radius: 5px;
                padding: 10px 20px;
                margin-bottom: 10px;

                .el-form-item {
                    float: left;
                    margin-bottom: 10px;
                }
            }

            .content {
                background: white;
                border-radius: 10px;
                padding: 10px 20px;
                height: calc(100% - 90px);

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
        }
    }
</style>