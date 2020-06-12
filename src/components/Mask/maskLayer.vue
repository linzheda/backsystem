<!--蒙版-->
<template>
    <div class="mask" v-if="isVisible" @click="closeMask">
        <div class="mask-content" @click.stop>
            <div class="header">
                <slot name="header"/>
            </div>
            <div class="main">
                <slot/>
            </div>
            <div class="footer">
                <slot name="footer"/>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "maskLayer",
        props: {
            isVisible: {
                type: Boolean,
                default: false
            }
        },
        mounted() {
            this.$nextTick(() => {
                const body = document.querySelector("body");
                if (body.append) {
                    body.append(this.$el);
                } else {
                    body.appendChild(this.$el);
                }
            });
        },
        methods:{
            closeMask(){
                this.isVisible=false;
                this.$emit('update:isVisible', false);
            }
        }
    }
</script>

<style scoped lang="scss">
    .mask {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 99999999;
        background: rgba(0, 0, 0, .3);
        display: flex;

        .mask-content {
            margin: auto;
            background: white;
            padding: 20px;
            border-radius: 5px;
        }
    }
</style>
