<template>
    <div class="dictManager">
        <div class="search">
            <el-form ref="form" label-width="80px">
                <el-form-item label="菜单名称:">
                    <el-input
                            placeholder="请输入内容"
                            prefix-icon="el-icon-search"
                            clearable
                            v-model="filter.name">
                    </el-input>
                </el-form-item>
                <el-form-item label-width="10px">
                    <el-button type="primary" icon="el-icon-search" round @click="loadData(null)">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>



    </div>
</template>

<script>
    export default {
        name: "dictManager",
        data() {
            return {
                filter: {
                    name: '',//菜单名称
                },//查询条件
                data: [],//列表数据
                showEditDialog: false,//是否显示编辑面板
                editData: {},//被选中编辑的数据
                isOpen: false,//展开与折叠状态 默认折叠
            }
        },
    }
</script>

<style scoped lang="scss">

</style>
