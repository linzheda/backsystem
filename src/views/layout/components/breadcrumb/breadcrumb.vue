<template>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item,index) in list" :key="index" :class="{'tui-cursor':item.name!=null}" @click="goPage(item,index)" >{{item.title}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
    export default {
        name: "breadcrumb",
        created() {
        },
        data() {
            return {
                list: []
            }
        },
        mounted() {
        },
        methods: {
            findPathByName(name, nodes, path) {//遍历菜单树 看看在不在菜单树里
                if (path === undefined) {
                    path = [];
                }
                for (let i = 0; i < nodes.length; i++) {
                    let tmpPath = path.concat();
                    if(nodes[i].children==null||nodes[i].children.length!=1){
                        tmpPath.push({title:nodes[i]['meta']['title'],name:nodes[i]['name']});
                    }
                    if (name === nodes[i]['name']) {
                        return tmpPath;
                    }
                    if (nodes[i].children) {
                        let findResult = this.findPathByName(name, nodes[i].children, tmpPath);
                        if (findResult) {
                            return findResult;
                        }
                    }
                }
            },
            buildList(list){//构造list
                if(list!=null&&list.length>0){
                    this.list=list;
                }else{
                    let meta=this.$route.meta;
                    if(meta['breadcrumb']!=null){
                        this.list=meta['breadcrumb'];
                    }else{
                        this.list={
                            title:meta['title'],
                            name:this.$route.name
                        };
                    }
                }
            },
            goPage(item,index){//跳转
                let num=index+1;
                if(item['name']&&num!==this.list.length){
                    this.$route.push({name:item['name']});
                }
            }
        },
        computed: {
            routeName() {
                return this.$route.name;
            },
            menus() {
                return this.$store.getters.menus;
            }
        },
        watch: {
            routeName: {
                handler(val){
                    let r = this.findPathByName(val, this.menus);
                    this.buildList(r);
                },
                immediate: true
            },
            menus(val) {
                let r = this.findPathByName(this.routeName, val);
                this.buildList(r);
            }
        }
    }
</script>

<style scoped lang="scss">

</style>
