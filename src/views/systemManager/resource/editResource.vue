<template>
    <div class="editResource">
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
            <el-form-item label="菜单类型" class="is-required">
                <el-radio-group v-model="form.type" @change="changeType">
                    <el-radio v-for="item of type_list" :key="item.value" :label="item.value">{{item.name}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="菜单名称" class="wid50 is-required">
                <el-input v-model="form.name" v-validate
                          data-rules="required" validate-name="name" validate-type="keyup"
                          validate-tips-required="请输入字典名称"></el-input>
                <el-alert v-if="errors.get('name')!=null" :title="errors.get('name')" type="error"/>
            </el-form-item>
            <el-form-item label="权限标识" class="wid50 is-required" v-if="form.type==3">
                <el-input v-model="form.premissions" v-validate
                          data-rules="required" validate-name="premissions" validate-type="keyup"
                          validate-tips-required="请输入字典名称"></el-input>
                <el-alert v-if="errors.get('premissions')!=null" :title="errors.get('premissions')" type="error"/>
            </el-form-item>
            <el-form-item label="显示排序" class="wid50">
                <el-input type="number" v-model="form.seq"></el-input>
            </el-form-item>
            <el-form-item label="描述">
                <el-input type="textarea" v-model="form.description"></el-input>
            </el-form-item>
            <el-form-item label="图标">
                <el-input v-model="form.icon" @blur="iconBlur()" @focus="showIcons=true"></el-input>
                <div v-if="showIcons" class="icon-div">
                    <span v-for="item of svgIcons" :key="item" @click="clickIcon(item)">
                        <svg-icon :icon-class="item" class-name="disabled"/>
                    </span>
                </div>
            </el-form-item>
            <el-form-item label="参数">
                <el-input v-model="form.attr"></el-input>
            </el-form-item>
            <el-form-item label="路由">
                <el-switch
                        v-model="routeSwitch"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                </el-switch>
            </el-form-item>
            <div v-if="routeSwitch">
                <el-form-item label="路径" class="wid50 is-required">
                    <el-input v-model="form.route.path" v-validate
                              data-rules="required" validate-name="route.path" validate-type="keyup"
                              validate-tips-required="请输入路径"></el-input>
                    <el-alert v-if="errors.get('route.path')!=null" :title="errors.get('route.path')" type="error"/>
                </el-form-item>
                <el-form-item label="名称" class="wid50 is-required">
                    <el-input v-model="form.route.name" v-validate
                              data-rules="required" validate-name="route.name" validate-type="keyup"
                              validate-tips-required="请输入名称"></el-input>
                    <el-alert v-if="errors.get('route.name')!=null" :title="errors.get('route.name')" type="error"/>
                </el-form-item>
                <el-form-item label="组件" class="is-required">
                    <el-input v-model="form.route.component" v-validate
                              data-rules="required" validate-name="route.component" validate-type="keyup"
                              validate-tips-required="请输入组件"></el-input>
                    <el-alert v-if="errors.get('route.component')!=null" :title="errors.get('route.component')" type="error"/>
                </el-form-item>
                <el-form-item label="重定位" class="wid50">
                    <el-input v-model="form.route.redirect"></el-input>
                </el-form-item>
                <el-form-item label="是否缓存" class="wid50">
                    <el-radio-group v-model="form.route.meta.keepAlive">
                        <el-radio :label="true">缓存</el-radio>
                        <el-radio :label="false">不缓存</el-radio>
                    </el-radio-group>
                </el-form-item>

            </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
                <el-button @click="showCurrentDialog = false">取 消</el-button>
                <el-button type="primary" @click="onSubmit">确 定</el-button>
        </span>
    </div>
</template>

<script>
    import svgIcons from '@/icons/svg-icons';
    import elDragDialog from '@/directives/el-drag-dialog';
    export default {
        name: "editResource",
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
                    icon:'',
                    name:'',
                    premissions:'',
                    pid:'',
                    pid_text:'',
                    level:null,
                    seq:null,
                    attr:null,
                    description:'',
                    type: 0,
                    route:{}
                },//表单数据
                type_list: [],//类型列表,
                showCurrentDialog: this.showDialog,//是否显示选择当前的dialog
                showPidDialog: false,//是否显示选择piddialog
                svgIcons: svgIcons,//图标集合
                showIcons: false,//是否显示图表
                routeSwitch: false,//是否有路由
                filterText:'',//树形数据过滤关键字
            }
        },
        watch: {
            showCurrentDialog(value) {
                if (value === false) {
                    this.$emit("update:showDialog", false);
                }
            },
            routeSwitch(value){
                if (value === false) {
                    this.$validator.removeValidateRules('route.path');
                    this.$validator.removeValidateRules('route.name');
                    this.$validator.removeValidateRules('route.component');
                }
            },
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        created() {
            this.getDict('resources_type').then(data => {
                this.type_list = data;
            });
            this.form = Object.assign( this.form, this.editData);
            let route  = {
                name: '',
                path: '',
                component: '',
                redirect: '',
                meta: {
                    keepAlive: true,
                }
            };
            if (this.$utils.isEmpty(this.editData['route'])) {
                this.routeSwitch = false;
            } else {
                this.routeSwitch = true;
                let temp = eval('(' + this.editData['route'] + ')');
                route = Object.assign(route, temp);
            }
            this.form['route'] = Object.assign({},route);
        },
        methods: {
            //获取数据字典
            getDict(key) {
                return new Promise(resolve => {
                    let param = {key: key}
                    this.$http.post("/pub/pubCtr/getDict", param).then(res => {
                        let data = res['data'];
                        data.forEach(item => {
                            item['value'] = Number(item['value']);
                        });
                        resolve(data);
                    });
                });
            },
            //失去焦点的不显示图表
            iconBlur() {
                setTimeout(() => {
                    this.showIcons = false
                }, 300)
            },
            //点击图标
            clickIcon(item) {
                this.form.icon = item;
            },
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
                    this.$http.post('/user/resources/getResourcesByPid', param).then(res => {
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
                    this.form['isn'] = node[0]['isn'];
                }else{
                    this.form['pid_text'] = '';
                    this.form['pid'] =0;
                }
                this.showPidDialog=false;
            },
            //改变菜单类型
            changeType(){
                if(this.form.type!=3){
                    this.$validator.removeValidateRules('premissions');
                }
            },
            //提交
            onSubmit() {
                if(this.$validator.checkAll()){
                    if( this.routeSwitch ){
                        this.form['route']['meta']['title'] = this.form['name'];
                        this.form['route']['meta']['icon'] = this.form['icon'];
                        this.form['route']['meta']['attr'] = this.form['attr'];
                    }
                    let editData = Object.assign({}, this.form);
                    editData['route'] = this.routeSwitch?JSON.stringify(editData['route']):'';
                    editData['type'] = Number(editData['type']);
                    this.$http.post("/user/resources/editResources", editData).then(res => {
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
    .icon-div {
        span {
            display: inline-block;
            width: 30px;
            height: 30px;

            svg {
                font-size: 18px;
            }
        }
    }

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
