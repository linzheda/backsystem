/**
* 描述: 导出excel
*
**/
<template>
    <div class="exportExcel" @click="clickExport">
        <slot>
            <el-button type="primary" v-bind="$attrs" icon="el-icon-upload">导出</el-button>
        </slot>
        <!--dialog 显示导出的文件类型 文件名称 -->
        <el-dialog v-el-drag-dialog
                   v-if="showDialog"
                   :append-to-body="true"
                   title="导出"
                   :visible.sync="showDialog"
                   width="400px">
            <el-form label-width="80px">
                <el-form-item label="文件名称:" required>
                    <el-input placeholder="请输入文件名称" v-model="name" clearable/>
                </el-form-item>
                <el-form-item label="导出的列" required>
                    <el-checkbox v-for="(item,index) of showHeader" :checked="item.isChecked" :key="index"
                                 @change="item.isChecked=$event">
                        {{item.text}}
                    </el-checkbox>
                </el-form-item>
                <el-form-item label="文件类型" required>
                    <el-select v-model="fileType" placeholder="请选择文件类型">
                        <el-option label="xlsx" value="xlsx"/>
                        <el-option label="csv" value="csv"/>
                        <el-option label="txt" value="txt"/>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showDialog = false">取 消</el-button>
                <el-button type="primary" @click="exportFile">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import elDragDialog from '@/directives/el-drag-dialog';

    export default {
        name: "exportExcel",
        directives: {elDragDialog},
        props: {
            fileName: {
                type: String,
                default: '导出的excel'
            },
            header: {
                type: Array,
                default: null
            },//头部
            data: {
                type: Array,
                default: null
            },//数据
            isDialog:{
                type:Boolean,
                default:true
            },//是否需要弹窗
        },
        data() {
            return {
                showHeader: [],
                showDialog: false,//是否显示弹窗
                name:'',//文件名
                fileType: 'xlsx',//文件类型
            }
        },
        created() {
            this.showHeader = [...this.header];
            this.name = this.fileName;
            this.showHeader.forEach(item => {
                item['isChecked'] = true;
            });
        },
        methods: {
            //点击导出
            clickExport() {
                if(this.isDialog){
                    this.showDialog = true;
                }else{
                    this.exportFile();
                }
            },
            //导出
            exportFile() {
                import('@/vendor/Export2Excel').then(excel => {
                    let arr = this.showHeader.filter(item => item['isChecked'] == true)
                    let tHeader = arr.map(item => item['text']);
                    let filterVal = arr.map(item => item['value']);
                    let data = this.formatJson(filterVal, this.data);
                    if (this.$utils.isEmpty(this.name)) {
                        this.$message({type: 'warning', message: '文件名不能为空'});
                        return;
                    }
                    if (arr.length === 0) {
                        this.$message({type: 'warning', message: '至少需要一个导出的列'});
                        return;
                    }
                    excel.export_json_to_excel({
                        header: tHeader, //表头 必填
                        data, //具体数据 必填
                        filename: this.name, //非必填
                        autoWidth: true, //非必填
                        bookType: this.fileType //非必填
                    });
                });
                this.showDialog = false;
            },

            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => {
                    if (j === 'timestamp') {
                        return this.$utils.dateFormat(v[j])
                    } else {
                        return v[j]
                    }
                }))
            }
        }
    }
</script>

<style scoped lang="scss">

</style>