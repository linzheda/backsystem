<template>
    <div class="serverinfo tui-wh100">
        <div class="card wh50">
            <h3>CPU信息</h3>
            <table>
                <tr>
                    <th style="width: 50%">属性</th>
                    <th>值</th>
                </tr>
                <tr>
                    <td>核心数</td>
                    <td>{{data.cpu.cpuNum}}</td>
                </tr>
                <tr>
                    <td>用户使用率</td>
                    <td>{{data.cpu.used+"%"}}</td>
                </tr>
                <tr>
                    <td>系统使用率</td>
                    <td>{{data.cpu.sys+"%"}}</td>
                </tr>
                <tr>
                    <td>当前空闲率</td>
                    <td>{{data.cpu.free+"%"}}</td>
                </tr>
            </table>
        </div>
        <div class="card wh50 tui-right">
            <h3>内存信息</h3>
            <table>
                <tr>
                    <th>属性</th>
                    <th>内存</th>
                    <th>JVM</th>
                </tr>
                <tr>
                    <td>总内存</td>
                    <td>{{data.mem.total+"GB"}}</td>
                    <td>{{data.jvm.total}}</td>
                </tr>
                <tr>
                    <td>已用内存</td>
                    <td>{{data.mem.used+"GB"}}</td>
                    <td>{{data.jvm.used}}</td>
                </tr>
                <tr>
                    <td>剩余内存</td>
                    <td>{{data.mem.free+"GB"}}</td>
                    <td>{{data.jvm.free}}</td>
                </tr>
                <tr>
                    <td>使用率</td>
                    <td>{{countPercent(data.mem.used,data.mem.total)}}</td>
                    <td>{{countPercent(data.jvm.used,data.jvm.total)}}</td>
                </tr>
            </table>
        </div>
        <div class="card wh100">
            <h3>JAVA虚拟机信息</h3>
            <table>
                <tr>
                    <th>Jvm名称</th>
                    <td>{{data.jvm.name}}</td>
                    <th>java版本</th>
                    <td>{{data.jvm.version}}</td>
                </tr>
                <tr>
                    <th>启动时间</th>
                    <td>{{data.jvm.startTime}}</td>
                    <th>运行时长</th>
                    <td>{{data.jvm.runTime}}</td>
                </tr>
                <tr>
                    <th>安装路径</th>
                    <td colspan="3" >{{data.jvm.home}}</td>
                </tr>
                <tr>
                    <th>项目路径</th>
                    <td colspan="3">{{data.sys.userDir}}</td>
                </tr>
            </table>
        </div>
        <div class="card wh100">
            <h3>服务器信息</h3>
            <table>
                <tr>
                    <th>服务器名称</th>
                    <td>{{data.sys.computerName}}</td>
                    <th>操作系统</th>
                    <td>{{data.sys.osName}}</td>
                </tr>
                <tr>
                    <th>服务器IP</th>
                    <td>{{data.sys.computerIp}}</td>
                    <th>系统架构</th>
                    <td>{{data.sys.osArch}}</td>
                </tr>
            </table>
        </div>
        <div class="card wh100">
            <h3>磁盘信息</h3>
            <table>
                <tr>
                    <th>盘符路径</th>
                    <th>文件系统</th>
                    <th>盘符类型</th>
                    <th>总大小</th>
                    <th>可用大小</th>
                    <th>已用大小</th>
                    <th>已用百分比</th>
                </tr>
                <tr v-for="(item,index) of data.sysFiles" :key="index">
                    <td>{{item.dirName}}</td>
                    <td>{{item.sysTypeName}}</td>
                    <td>
                        {{item.typeName}}
                    </td>
                    <td>{{item.total}}</td>
                    <td>{{item.free}}</td>
                    <td>{{item.used}}</td>
                    <td>{{countPercent(item.used,item.total)}}</td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
    export default {
        name: "serverinfo",
        data() {
            return {
                data: {
                    cpu: {
                        cpuNum: 0,
                        total: 0,
                        sys: 0,
                        used: 0,
                        wait: 0,
                        free: 0
                    },
                    mem: {
                        total: 0,
                        used: 0,
                        free: 0,
                        usage: 0
                    },
                    jvm: {
                        total: 0,
                        max: 0,
                        free: 0,
                        version: "",
                        home: "",
                        name: "",
                        startTime: "",
                        usage: 0,
                        used: 0,
                        runTime: ""
                    },
                    sys: {
                        computerName: "",
                        computerIp: "",
                        userDir: "",
                        osName: "",
                        osArch: ""
                    },
                    sysFiles: []
                },//数据
            }
        },
        created() {
            this.getInfo();
            setInterval(()=>{
                this.getInfo();
            },60*1000)
        },
        mounted() {
        },
        methods: {
            //获取服务器信息
            getInfo() {
                this.$http.get("serverinfo/serverInfoCtr/getInfo").then(res => {
                    this.data = res['data'];
                });
            },
            //计算百分比
            countPercent(fz,fm){
                return this.$utils.countPercent(fz, fm);
            }
        }
    }
</script>

<style scoped lang="scss">
    .serverinfo {
        overflow-y: auto;

        .card {
            display: inline-block;
            margin-bottom: 10px;

            &.wh50 {
                width: 47.5%;
            }

            &.wh100 {
                width: 97%;
            }

            background: white;
            padding: 10px 20px;

            h3 {
                color: #8c939d;
            }

            table {
                width: 100%;
                border: 1px;
                text-align: center;

                th {
                    padding: 8px 0;
                    width: auto;
                    background: #e4e6e8;
                }
            }
        }
    }
</style>