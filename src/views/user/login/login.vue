<template>

    <div class="login">
        <div class="eui-logbg">
            <div class="eui-logMain">
                <div class="eui-logR">
                    <h2>您好！</h2>
                    <h3>欢迎来到我们的管理系统！</h3>
                    <p>
                        <input type="text" class="eui-logIpt" placeholder="请输入账号" v-model="username"
                               v-validate
                               data-rules="required" validate-name="login1" validate-type="keyup"
                               validate-tips-required="请输入用户名" /></p>
                        <span class="error">{{errors.get('login1')}}</span>
                    <p>
                        <input type="password" class="eui-logIpt" v-model="password" placeholder="请输入密码"
                               v-validate data-rules="required" validate-name="login2" validate-type="keyup"
                               validate-tips-required="请输入密码"/>
                        <span class="error">{{errors.get('login2')}}</span>
                    </p>
                    <p>
                        <input type="text" class="eui-logIpt" style="width: 180px;" placeholder="请输入验证码"/>
                        <span ref="verificationCode"   class="verificationCode" @click="resetCode()">
                            <canvas ref="verifyCanvas" width="100" height="40" id="verifyCanvas"></canvas>
                            <img ref="code_img" id="code_img" >
                        </span>
                        <span class="error">{{errors.get('login3')}}</span>
                    </p>
                    <a @click="login" class="eui-logBtn">登录</a>
                </div>
            </div>
            <div class="eui-canvas" >
                <div class="eui-logo"><!--<img src="@/assets/logo.png"/>--></div>
                <canvas id="canvas" width="100%" height="100%"/>
            </div>
        </div>
    </div>
</template>

<script>
    import md5 from 'js-md5';
    export default {
        name: "login",
        data() {
            return {
                username: '',
                password: '',
                //--------------------验证码-------------------------//
                nums : ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0",
                    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
                    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
                ],
                testCode:'',//输入的验证码
                testTrueCode:'',//绘制的验证码
            }
        },
        created() {
            if (this.$store.getters.env=='dev'){
                this.username='admin';
                this.password='admin';
            }
        },
        mounted() {
            this.resetCode();
        },
        methods: {
            login() {
                let flag=false;
                if (this.$store.getters.env=='dev'){
                    flag=true;
                }else{
                    flag=this.testTrueCode==this.testCode?true:false;
                }
                if(!flag){
                    this.$message({
                        showClose: true,
                        message: '验证码错误',
                        type: 'error'
                    });
                    return;
                }
                if (this.$validator.checkAll()) {
                    let jsonParam = {
                        name: this.username,
                        password: md5(this.password)
                    };
                    this.$store.dispatch('Login', jsonParam).then(res => {
                        if (res.code == 500) {
                            this.$message({
                                showClose: true,
                                message: res.msg,
                                type: 'error'
                            });
                        }else{
                            this.$store.dispatch('getMenu').then((res)=>{
                                this.$router.addRoutes(res);
                                this.$router.push({name: 'dashboard'});
                            });
                        }
                    });
                }
            },
            // 绘制验证码
            drawCode (str='') {
                let canvas = document.getElementById("verifyCanvas"); //获取HTML端画布
                // eslint-disable-next-line no-self-assign
                canvas.height=canvas.height;
                let context = canvas.getContext("2d"); //获取画布2D上下文
                context.fillStyle = "cornflowerblue"; //画布填充色
                context.fillRect(0, 0, canvas.width, canvas.height); //清空画布
                context.fillStyle = "white"; //设置字体颜色
                context.font = "25px Arial"; //设置字体
                let rand = new Array();
                let x = new Array();
                let y = new Array();
                for (let i = 0; i < 4; i++) {
                    rand.push(rand[i]);
                    rand[i] = this.nums[Math.floor(Math.random() * this.nums.length)]
                    x[i] = i * 20 + 10;
                    y[i] = Math.random() * 20 + 20;
                    context.fillText(rand[i], x[i], y[i]);
                }
                str = rand.join('').toUpperCase();
                //画3条随机线
                for (let i = 0; i < 3; i++) {
                    this.drawline(canvas, context);
                }
                // 画30个随机点
                for (let i = 0; i < 30; i++) {
                    this.drawDot(canvas, context);
                }
                this.convertCanvasToImage(canvas);
                return str;
            },
            // 随机线
            drawline (canvas, context) {
                context.moveTo(Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height)); //随机线的起点x坐标是画布x坐标0位置，y坐标是画布高度的随机数
                context.lineTo(Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height)); //随机线的终点x坐标是画布宽度，y坐标是画布高度的随机数
                context.lineWidth = 0.5; //随机线宽
                context.strokeStyle = 'rgba(50,50,50,0.3)'; //随机线描边属性
                context.stroke(); //描边，即起点描到终点
            },
            // 随机点(所谓画点其实就是画1px像素的线，方法不再赘述)
            drawDot (canvas, context) {
                let px = Math.floor(Math.random() * canvas.width);
                let py = Math.floor(Math.random() * canvas.height);
                context.moveTo(px, py);
                context.lineTo(px + 1, py + 1);
                context.lineWidth = 0.2;
                context.stroke();
            },
            // 绘制图片
            convertCanvasToImage (canvas) {
                document.getElementById("verifyCanvas").style.display = "none";
                let image = document.getElementById("code_img");
                image.src = canvas.toDataURL("image/png");
                return image;
            },
            //绘制验证码
            resetCode () {
                this.testTrueCode = this.drawCode();
            }

        }
    }
</script>

<style scoped lang="scss">
    /* 登录页面样式 */
    .eui-logbg {
        width: 100vw;
        height: 100vh;
        position: absolute;
        background: url('~@/assets/images/login/log-bg.png') no-repeat center center fixed;
        overflow: hidden;
    }

    .eui-logMain {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 1254px;
        background: url('~@/assets/images/login/log-M.png') no-repeat;
        background-size: cover;
        z-index: 10;
    }

    .eui-logR {
        position: absolute;
        top: 50%;
        left: 130px;
        width: 378px;
        height: 400px;
        padding: 0 35px;
        transform: translateY(-55%);
    }

    .eui-logR h2 {
        font-family: "微软雅黑";
        font-size: 30px;
        color: #323232;
        font-weight: 400;
        line-height: 30px;
        margin: 0;


    }

    .eui-logR h3 {
        font-family: "微软雅黑";
        font-size: 24px;
        color: #323232;
        font-weight: 400;
        line-height: 24px;
        margin: 20px 0 30px 0;
    }

    .eui-logR p {
        height: 44px;
        margin: 0 0 16px 0;
        font-family: "微软雅黑";
        font-size: 14px;
    }

    .eui-logIpt {
        width: 90%;
        height: 44px;
        line-height: 44px;
        padding: 0 18px;
        border: 1px solid #d5dfec;
        border-radius: 3px;
    }

    .eui-logIpt:hover, .eui-logIpt:focus {
        border: 1px solid #0DCC6C;
        box-shadow: 0 0 12px rgba(53, 157, 253, 0.16);
    }

    .eui-logR p label {
        color: #323232;
        margin-left: -145px;
    }

    .eui-logR p label input {
        float: left;
        width: 20px;
        height: 20px;
        margin-right: 4px;
    }

    .eui-logR p a {
        float: right;
        color: #323232;
    }

    .eui-logR p a:hover {
        color: #359dfd;
    }

    .eui-logBtn {
        display: block;
        width: 100%;
        height: 40px;
        line-height: 40px;
        font-family: "微软雅黑";
        font-size: 16px;
        text-align: center;
        color: #fff;
        border-radius: 50px;
        overflow: hidden;
    }

    .eui-logBtn {
        background: url('~@/assets/images/login/log-btn.png') no-repeat;
        background-size: cover;
    }

    .eui-logBtn:hover {
        box-shadow: 6px 6px 16px rgba(89, 226, 178, 0.45);
        transition: box-shadow 0.3s;
    }

    .eui-canvas {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .eui-logo {
        position: absolute;
        top: 50%;
        right: 300px;
        transform: translateY(-50%);
    }
    .verificationCode{
        display: inline-block;
        vertical-align: middle;
        margin-left: 35px;
    }
</style>
