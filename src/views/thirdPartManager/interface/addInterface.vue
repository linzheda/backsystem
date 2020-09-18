<template>
    <div class="addInterface tui-wh100">
        <div class="content">
            <el-table :data="data" row-key="url"  height=" calc(100% - 20px)"  ref="table">
                <template v-for="item of showColumns">
                    <el-table-column :key="item.prop" v-if="item.isShow"
                                     :prop="item.prop" :label="item.label"
                                     :sortable="item.sortable" :fixed="item.fixed"
                                     :width="item.width" :align="item.align"></el-table-column>
                </template>
            </el-table>
        </div>
        <span slot="footer" class="dialog-footer">
                <el-button @click="showCurrentDialog = false">取 消</el-button>
                <el-button type="primary" @click="onSubmit">新 增</el-button>
        </span>
    </div>
</template>

<script>
    export default {
        name: "addInterface",
        props: {
            showDialog: Boolean,//是否显示dialog
        },
        data() {
            return {
                showCurrentDialog: this.showDialog,//是否显示选择当前的dialog
                data:[],//能够新增的数据
                showColumns: [
                    {label: '接口名称', prop: 'name', width: 180, isShow: true},
                    {label: '接口地址', prop: 'url', align: 'center', width: 150, isShow: true},
                    {label: '访问路径', prop: 'path', align: 'center',  isShow: true},
                    {label: '方法', prop: 'method', align: 'center',width: 120,  isShow: true},
                    {label: '请求类型', prop: 'type', align: 'center', width: 80,  isShow: true},
                ],//显示的列
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
            this.getInterfaceUrl();
        },
        mounted() {
        },
        methods: {
            //获取未入库的接口
            getInterfaceUrl(){
                this.$http.post("/dockinginterface/manager/getInterfaceUrl").then(res=>{
                    this.data=res.data;
                });
            },
            onSubmit(){
                this.$confirm('您确定要新增这些接口吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let param={
                        list: JSON.stringify(this.data)
                    };
                    this.$http.post("/dockinginterface/manager/addInterfaceList",param).then(res=>{
                        if (res['data']) {
                            this.showCurrentDialog = false;
                            this.$message({
                                message: res['msg'],
                                type: 'success'
                            });
                            this.$emit("reloadData", null);
                        } else {
                            this.$message.error(res['msg']);
                        }
                    });
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    .dialog-footer {
        text-align: right;
        display: block;
    }

    .content{
        width: 100%;
        height: 500px;
    }

</style>