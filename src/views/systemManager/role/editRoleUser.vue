<template>
    <div class="editRoleUser">
        <div class="content">
            <table-transfer
                    :show-query="true"
                    :show-pagination="true"
                    :pagination-call-back="paginationCallBack"
                    :left-columns="leftColumns"
                    :title-texts="['待选','已选']"
                    :button-texts="['添加','删除']"
                    :query-texts="['筛选','筛选']"
                    :table-row-key="row => row.id"
                    v-model="rightTableData">
                <template v-slot:leftCondition="{scope}">
                    <el-form-item label="姓名/登录名">
                        <el-input v-model="scope.keyWord" placeholder="姓名/登录名"></el-input>
                    </el-form-item>
                    <el-form-item label="电话">
                        <el-input v-model="scope.tel" placeholder="电话"></el-input>
                    </el-form-item>
                </template>
                <template v-slot:rightCondition="{scope}">
                    <el-form-item label="名称">
                        <el-input v-model="scope.name" placeholder="名称"></el-input>
                    </el-form-item>
                </template>
            </table-transfer>

        </div>
        <span slot="footer" class="dialog-footer">
                <el-button @click="showCurrentDialog = false">取 消</el-button>
                <el-button type="primary" @click="onSubmit">确 定</el-button>
        </span>
    </div>
</template>

<script>
    import TableTransfer from "../../../components/tableTransfer/tableTransfer";

    export default {
        name: "editRoleUser",
        components: {TableTransfer},
        props: {
            showDialog: Boolean,//是否显示dialog
            editData: {
                type: Object,
                default: null
            }
        },
        data() {
            return {
                showCurrentDialog: this.showDialog,//是否显示选择当前的dialog
                leftColumns: [
                    {label: '姓名', prop: 'name', width: '120px'},
                    {label: '登录名', prop: 'loginname', width: '120px'},
                    {label: '电话', prop: 'tel', width: '120px'},
                    {label: '组织', prop: 'orgname', width: '120px'},
                ],
                rightTableData: [],//这个角色的用户列表(会变)
                userListByRoeId: [],//这个角色的用户列表
                leftTableData: [],//左侧用户数据
            }
        },
        watch: {
            showCurrentDialog(value) {
                if (value === false) {
                    this.$emit("update:showDialog", false);
                }
            }
        },
        created() {
            this.getUserListByRoleId().then(res => {
                this.rightTableData = res;
                [...this.userListByRoeId] = this.rightTableData;
            });
        },
        mounted() {
        },
        methods: {
            //获取这个角色的用户列表
            getUserListByRoleId() {
                let param = {
                    roleid: this.editData['id']
                };
                return new Promise(resolve => {
                    this.$http.post("/user/roleUser/getUserListByRoleId", param).then(res => {
                        resolve(res['data']);
                    });
                })
            },
            //获取用户列表
            paginationCallBack(obj) {
                return new Promise(((resolve, reject) => {
                    try {
                        this.$http.post('/user/roleUser/getUserListByCondition', obj).then(res => {
                            this.leftTableData = res.data.records;
                            resolve({total: Number(res.data.total), data: res.data.records});
                        });
                    } catch {
                        reject()
                    }
                }))
            },

            //提交
            onSubmit() {
                let addArr = [];
                let delArr = [];
                this.rightTableData.forEach(item => {
                    if (!this.userListByRoeId.some(item2 => item.id === item2.id)) {
                        addArr.push(item['id']);
                    }
                });
                this.userListByRoeId.forEach(item => {
                    if (!this.rightTableData.some(item2 => item.id === item2.id)) {
                        delArr.push(item['id']);
                    }
                });
                if (addArr.length > 0 || delArr.length > 0) {
                    let param = {
                        roleid: this.editData['id'],
                        addArr: addArr,
                        delArr: delArr,
                    };
                    this.$http.post('/user/roleUser/updateRoleUserByRoleId', param).then(res => {
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
                    this.$message.warning("用户未分配");
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