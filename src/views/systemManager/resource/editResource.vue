<template>
    <div class="editResource">
        <el-form ref="form" label-width="90px">
            <el-form-item label="上级菜单">
                <el-input :disabled="true" @click="showPidDialog=true" v-model="form.pid_text"></el-input>
            </el-form-item>
            <el-form-item label="菜单类型">
                <el-radio-group v-model="form.type">
                    <el-radio v-for="item of type_list" :key="item.value" :label="item.value">{{item.name}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="菜单名称">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="显示排序">
                <el-input v-model="form.seq"></el-input>
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
                <el-form-item label="路由路径">
                    <el-input v-model="form.route.path"></el-input>
                </el-form-item>
                <el-form-item label="路由组件">
                    <el-input v-model="form.route.component"></el-input>
                </el-form-item>
                <el-form-item label="路由名称">
                    <el-input v-model="form.route.name"></el-input>
                </el-form-item>
                <el-form-item label="路由重定位">
                    <el-input v-model="form.route.redirect"></el-input>
                </el-form-item>
                <el-form-item label="路由缓存">
                    <el-radio-group v-model="form.route.meta.keepAlive">
                        <el-radio :label="true" >缓存</el-radio>
                        <el-radio :label="false" >不缓存</el-radio>
                    </el-radio-group>
                </el-form-item>

            </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
                <el-button @click="isVisible = false">取 消</el-button>
                <el-button type="primary" @click="onSubmit">确 定</el-button>
        </span>
    </div>
</template>

<script>
    import svgIcons from '@/icons/svg-icons'

    export default {
        name: "editResource",
        props: {
            editData: {
                type: Object,
                default: null
            }
        },
        data() {
            return {
                form: {
                    type: 0
                },//表单数据
                type_list: [],//类型列表,
                showDialog: true,//是否显示dialog
                showPidDialog: false,//是否显示选择piddialog
                svgIcons: svgIcons,//图标集合
                showIcons: false,//是否显示图表
                routeSwitch: false,//是否有路由
            }
        },
        watch: {
            showDialog(value) {
                if (value === false) {
                    this.$emit("showDialog", false);
                }
            }
        },
        created() {
            this.getDict('resources_type').then(data => {
                this.type_list = data;
            });
            this.form = Object.assign({}, this.editData);
            let route = {
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
                let temp =eval('(' +this.editData['route'] + ')');
                route = Object.assign( route, temp);
            }
            this.form['route'] = route;
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
            iconBlur() {
                setTimeout(() => {
                    this.showIcons = false
                }, 300)
            },
            //点击图标
            clickIcon(item) {
                this.form.icon = item;
            },
            //提交
            onSubmit() {
                this.form['route']['meta']['title'] = this.form['name'];
                this.form['route']['meta']['icon'] = this.form['icon'];
                this.form['route']['meta']['attr'] = this.form['attr'];
                let editData=Object.assign({},this.form);
                editData['route'] = JSON.stringify(editData['route']);
                console.log(editData);
                editData['type'] = Number(editData['type']);
                debugger
                this.$http.post("/user/resources/editResources", editData).then(res => {
                    if(res['data']){
                        this.showDialog=false;
                        this.$message({
                            message: '恭喜你，编辑成功',
                            type: 'success'
                        });
                    }else{
                        this.$message.error('编辑失败');
                    }
                });
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
</style>
