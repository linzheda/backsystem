<template>
    <div class="update-password"  >
        <el-form ref="form" label-width="80px">
            <el-form-item label="用户名">
                <el-input v-model="user.name" :disabled="true"/>
            </el-form-item>
            <el-form-item label="旧密码">
                <el-input v-model="user.oldPassword" show-password v-validate
                          data-rules="required" validate-name="pwd1" validate-type="keyup"
                          validate-tips-required="请输入旧密码"/>
                <el-alert v-if="errors.get('pwd1')!=null" :title="errors.get('pwd1')" type="error"/>
            </el-form-item>
            <el-form-item label="新密码">
                <el-input v-model="user.newPassword" show-password v-validate
                          data-rules="required" validate-name="pwd2" validate-type="keyup"
                          validate-tips-required="请输入新密码"/>
                <el-alert v-if="errors.get('pwd2')!=null" :title="errors.get('pwd2')" type="error"/>
            </el-form-item>
            <el-form-item label="再次确认">
                <el-input v-model="user.newPasswordAgain" show-password v-validate
                          data-rules="required" validate-name="pwd3" validate-type="keyup"
                          validate-tips-required="请输入新密码"/>
                <el-alert v-if="errors.get('pwd3')!=null" :title="errors.get('pwd3')" type="error"/>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
                <el-button @click="isVisible = false">取 消</el-button>
                <el-button type="primary" @click="onSubmit">确 定</el-button>
        </span>
    </div>
</template>

<script>
    export default {
        name: "updatePassword",
        data() {
            return {
                user: {
                    id: '',
                    name: '',
                    oldPassword: '',
                    newPassword: '',
                    newPasswordAgain: '',
                },
                isVisible: true,
            }
        },
        created() {
            this.user.id = this.$store.getters.id;
            this.user.name = this.$store.getters.name;
        },
        watch: {
            isVisible(value) {
                if(value===false){
                    this.$emit("isVisible", false);
                }
            }
        },
        methods: {
            //修改密码
            onSubmit() {
                if(this.$validator.checkAll()){
                    this.$http.post('user/userCtr/updatePassword',this.user).then((res)=>{
                        if(res.data){
                            this.$message({
                                message: res.msg,
                                type: 'success'
                            });
                            this.$router.push({name: 'login'});
                        }else{
                            this.$message.error(res['msg']);
                        }
                    });
                }else{
                    this.$message.error(this.errors['errors'][0]['msg']);
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .update-password {
        background: #ffffff;
        margin: auto;
        padding: 0 50px;
        border-radius: 5px;
        .dialog-footer{
            text-align: right;
            display: block;
        }
        .el-alert{
            padding: 0px 16px;
        }
    }

</style>
