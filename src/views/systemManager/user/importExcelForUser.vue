/**
* 描述: 导入用户excel
*
**/
<template>
    <div class="importExcelForUser">
        <el-button type="primary" icon="el-icon-download" round @click="showDialog=true">导入</el-button>
        <el-dialog v-el-drag-dialog
                   v-if="showDialog"
                   :append-to-body="true"
                   title="导入用户数据"
                   :visible.sync="showDialog"
                   width="600px">
            <import-excel :on-success="onSuccess" />
            <div class="checkbox-tip">
                <p> <el-checkbox v-model="isUpdate" > 是否更新已经存在的用户数据</el-checkbox></p>
                仅允许导入xls、xlsx格式文件。<a :href="downloadHref" target="_blank" download="user.xlsx">下载模板</a>
            </div>

            <div class="file-list">
                <ul>
                    <li v-for="(item,index) of dataList" :key="index" >
                        <div class="left">
                            <i class="el-icon-document"></i>
                            {{item['fileName']}}
                        </div>
                        <div class="right">
                            <i class="el-icon-delete"></i>
                        </div>
                    </li>
                </ul>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="showDialog = false">取 消</el-button>
                <el-button type="primary" >确 定</el-button>
            </span>
        </el-dialog>

    </div>

</template>

<script>
    import ImportExcel from "../../../components/importExcel/importExcel";
    import elDragDialog from '@/directives/el-drag-dialog';

    export default {
        name: "importExcelForUser",
        directives: {elDragDialog},
        components: {ImportExcel},
        data() {
            return {
                downloadHref:'',//模板的下载地址
                showDialog: false,//是否显示选择面板
                isUpdate: false,//是否更新已存在的数据
                dataList:[],//数据集合
            }
        },
        created() {
            this.downloadHref = this.$http.urlApi['base'] + 'excel/user.xlsx';
            console.log(this.downloadHref);
        },
        methods: {
            //上传成功数据处理
            onSuccess(data){
                let index=this.dataList.findIndex(i=>{
                    return i['name'] === data['name'];
                });
                if(index==-1){
                    this.dataList.push(data);
                }else{
                    this.dataList[index] = data;
                }
                console.log(this.dataList);
            },
            //处理数据



        }
    }
</script>

<style scoped lang="scss">
    .importExcelForUser {
        display: inline-block;

    }
    .checkbox-tip{
        text-align: center;
        margin: 10px auto 10px;
        a{
            color: blue;

        }
    }

    .file-list{
        ul li{
            list-style-type: none;
            display: flex;
            justify-content: space-between;
            font-size: 16px;
            padding-right: 30px;
        }
    }


</style>