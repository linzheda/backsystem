<template>
    <div class="editRoleResources">
        <el-input prefix-icon="el-icon-search"
                  placeholder="输入关键字进行过滤"
                  v-model="filterText">
        </el-input>
        <el-tree
                :props="{children: 'children',label: 'name',isLeaf: 'leaf'}"
                ref="tree"
                :data="treeData"
                show-checkbox
                :default-checked-keys="showCheckedArr"
                node-key="id"
                @check="changeChecked"
                :filter-node-method="filterNode">
        </el-tree>
        <span slot="footer" class="dialog-footer">
                <el-button @click="showCurrentDialog = false">取 消</el-button>
                <el-button type="primary" @click="onSubmit">确 定</el-button>
        </span>
    </div>
</template>

<script>
    export default {
        name: "editRoleResources",
        props: {
            showDialog: Boolean,//是否显示dialog
            editData: {
                type: Object,
                default: null
            }
        },
        data() {
            return {
                defaultCheckedArr: [],//被选中的数组
                showCheckedArr: [],//展示被选中的数组(只要叶子节点)
                addCheckedArr: [],//新增的资源数据
                delCheckedArr: [],//删除的资源数据
                treeData: [],//树形数据
                filterText: '',//树形数据过滤关键字
                showCurrentDialog: this.showDialog,//是否显示选择当前的dialog
            }
        },
        watch: {
            showCurrentDialog(value) {
                if (value === false) {
                    this.$emit("update:showDialog", false);
                }
            },
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        created() {
            this.getTreeByPid(null).then(res => {
                this.treeData = res;
            });
        },
        mounted() {
        },
        methods: {
            //获取菜单
            getTreeByPid(pid) {
                let param = {
                    roleid: this.editData['id'],
                    pid: pid
                };
                return new Promise(resolve => {
                    this.$http.post('user/roleResources/getResourcesListByRoleId', param).then(res => {
                        let data = res['data'];
                        let forTree = (arr) => {
                            arr.forEach(item => {
                                if(item['ischecked']==1){
                                    this.defaultCheckedArr.push(item['id']);
                                    if(item['children_cnt']<=0){
                                        this.showCheckedArr.push(item['id']);
                                    }
                                }
                                if(item['children_cnt']>0){
                                    forTree(item['children']);
                                }
                            });
                        };
                        forTree(data);
                        resolve(data);
                    });
                });
            },
            //过滤方法
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            //改变选择框时 判断是否在默认数组里
            changeChecked() {
                let checkedArr = this.$refs.tree.getCheckedNodes(false, true);
                let delCheckedArr = this.defaultCheckedArr.filter(item => !checkedArr.some(item2 => item === item2['id']));
                let addCheckedArr = checkedArr.filter(item => !this.defaultCheckedArr.some(item2 => item['id'] === item2));
                this.addCheckedArr = addCheckedArr.map(i => i['id']);
                this.delCheckedArr = delCheckedArr;
            },
            //提交
            onSubmit() {
                if (this.addCheckedArr.length > 0 || this.delCheckedArr.length > 0) {
                    let param = {
                        roleid: this.editData['id'],
                        addArr: this.addCheckedArr,
                        delArr: this.delCheckedArr,
                    };
                    this.$http.post('user/roleResources/updateRoleResourcesByRoleId', param).then(res => {
                        if (res['data']['isSuccess']) {
                            this.showCurrentDialog = false;
                            this.$message({
                                message: res['msg'],
                                type: 'success'
                            });
                        } else {
                            this.$message.error(res['msg']);
                        }
                    });
                } else {
                    this.showCurrentDialog = false;
                    this.$message.warning("资源菜单未更改");
                }
            }
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

    .wid50 {
        width: 50%;
        display: inline-block;
    }
</style>