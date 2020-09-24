<template>
    <div class="editRoleResources">
        <el-input prefix-icon="el-icon-search"
                placeholder="输入关键字进行过滤"
                v-model="filterText">
        </el-input>
        <el-tree
                :props="{children: 'children',label: 'name',isLeaf: 'leaf'}"
                ref="tree"
                show-checkbox
                check-strictly
                :default-checked-keys="defaultCheckedArr"
                node-key="id"
                @check-change="changeChecked"
                :load="loadNode"
                :filter-node-method="filterNode"
                lazy>
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
                addCheckedArr: [],//新增的资源数据
                delCheckedArr: [],//删除的资源数据
                treeData:[],//树形数据
                filterText:'',//树形数据过滤关键字
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
                        data.forEach(item => {
                            item['leaf'] = item['children_cnt'] > 0 ? false : true;
                            item['label'] = item['name'];
                            if (item['ischecked'] == 1) {//说明是被选中的节点
                                this.defaultCheckedArr.push(item['id']);
                            }
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
            filterNode(value,data){
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            //改变选择框时 判断是否在默认数组里
            changeChecked(data, checked) {
                let index = this.defaultCheckedArr.findIndex(item => {return item == data['id']});
                if (checked) {//说明是选中
                    if(index==-1){//说明默认不存在
                        this.addCheckedArr.push(data['id']);
                    }else{
                        let temp = this.delCheckedArr.findIndex(item => {return item == data['id']});
                        this.delCheckedArr.splice(temp, 1);
                    }
                }else{//说明是取消
                    if(index==-1){
                        let temp = this.addCheckedArr.findIndex(item => {return item == data['id']});
                        this.addCheckedArr.splice(temp, 1);
                    }else{
                        this.delCheckedArr.push(data['id']);
                    }
                }
            },
            //提交
            onSubmit() {
                if(this.addCheckedArr.length>0||this.delCheckedArr.length>0){
                    let param={
                        roleid: this.editData['id'],
                        addArr:this.addCheckedArr,
                        delArr:this.delCheckedArr,
                    };
                    this.$http.post('user/roleResources/updateRoleResourcesByRoleId',param).then(res => {
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
                }else{
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