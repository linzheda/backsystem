<template>
    <div class="editDict">
        <el-dialog v-el-drag-dialog
                   v-if="showPidDialog"
                   :append-to-body="true"
                   title="选择上级菜单"
                   :visible.sync="showPidDialog"
                   width="20%">
            <el-input placeholder="输入关键字进行过滤" prefix-icon="el-icon-search"  v-model="filterText">
            </el-input>
            <el-tree :props="{children: 'children',label: 'name',isLeaf: 'leaf'}"
                     check-strictly
                     ref="tree"
                     show-checkbox
                     default-expand-all
                     :default-checked-keys="[form['pid']]"
                     node-key="id"
                     @check-change="treeRadio"
                     :load="loadNode"
                     :filter-node-method="filterNode"
                     lazy></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showPidDialog = false">取 消</el-button>
                <el-button type="primary" @click="changePid">确 定</el-button>
        </span>
        </el-dialog>
        <el-form ref="form" label-width="6em">
            <el-form-item label="上级菜单">
                <el-input :disabled="true" @click.native="showPidDialog=true" v-model="form.pid_text"
                          suffix-icon="el-icon-search"></el-input>
            </el-form-item>
            <el-form-item label="字典名称" class="wid50 is-required">
                <el-input v-model="form.name" v-validate
                          data-rules="required" validate-name="name" validate-type="keyup"
                          validate-tips-required="请输入字典名称"></el-input>
                <el-alert v-if="errors.get('name')!=null" :title="errors.get('name')" type="error"/>
            </el-form-item>
            <el-form-item label="字典键" class="is-required" >
                <el-input v-model="form.dictkey" v-validate
                          data-rules="required" validate-name="dictkey" validate-type="keyup"
                          validate-tips-required="请输入字典键"></el-input>
                <el-alert v-if="errors.get('dictkey')!=null" :title="errors.get('dictkey')" type="error"/>
            </el-form-item>
            <el-form-item label="字典值">
                <el-input v-model="form.value"></el-input>
            </el-form-item>
            <el-form-item label="显示排序" class="wid50">
                <el-input type="number" v-model="form.seq"></el-input>
            </el-form-item>
            <el-form-item label="描述">
                <el-input type="textarea" v-model="form.description"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
                <el-button @click="showCurrentDialog = false">取 消</el-button>
                <el-button type="primary" @click="onSubmit">确 定</el-button>
        </span>
    </div>
</template>

<script>
    import elDragDialog from '@/directives/el-drag-dialog';
    export default {
        name: "editDict",
        directives: {elDragDialog},
        props: {
            showDialog: Boolean,//是否显示dialog
            editData: {
                type: Object,
                default: null
            }
        },
        data() {
            return {
                form: {
                    id:'',
                    name:'',
                    pid:'',
                    dictkey:'',
                    value:'',
                    pid_text:'',
                    level:null,
                    seq:null,
                    description:'',
                },//表单数据
                showCurrentDialog: this.showDialog,//是否显示选择当前的dialog
                showPidDialog: false,//是否显示选择piddialog
                filterText:'',//树形数据过滤关键字
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
            this.form = Object.assign( this.form, this.editData);
        },
        mounted() {
        },
        methods: {
            //菜单树加载
            loadNode(node, resolve) {
                let pid = this.$utils.isNotEmpty(node['data']) ? node['data']['id'] : 0;
                this.getPTreeByPid(pid).then(res => {
                    resolve(res);
                });
            },
            //菜单树单选控制
            treeRadio(data, checked) {
                if (checked) {
                    this.$refs.tree.setCheckedNodes([data]);
                }
            },
            //过滤方法
            filterNode(value,data){
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            //获取菜单
            getPTreeByPid(pid) {
                let param = {
                    pid: pid,
                    filter_id: this.form['id']
                };
                return new Promise(resolve => {
                    this.$http.post('dictionary/dictionary/getDictsByPid', param).then(res => {
                        let data = res['data'];
                        data.forEach(item => {
                            item['leaf'] = item['children_cnt'] > 0 ? false : true;
                            item['label'] = item['name'];
                        });
                        resolve(data);
                    });
                });
            },
            //确定改变父级菜单的id
            changePid() {
                let node = this.$refs.tree.getCheckedNodes();
                if(node!=null){//说明有选择
                    this.form['pid_text'] = node[0]['name'];
                    this.form['pid'] = node[0]['id'];
                    this.form['level'] = node[0]['level']+1;
                }else{
                    this.form['pid_text'] = '';
                    this.form['pid'] =0;
                }
                this.showPidDialog=false;
            },
            //提交
            onSubmit() {
                if(this.$validator.checkAll()){
                    let editData = Object.assign({}, this.form);
                    this.$http.post("dictionary/dictionary/editDict", editData).then(res => {
                        if (res['data']['isSuccess']) {
                            this.showCurrentDialog = false;
                            this.$message({
                                message: res['msg'],
                                type: 'success'
                            });
                            this.$emit("reloadData", this.form['pid']);
                        } else {
                            this.$message.error(res['msg']);
                        }
                    });
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

    .el-alert{
        padding: 0 16px;
    }

    .wid50 {
        width: 50%;
        display: inline-block;
    }
</style>