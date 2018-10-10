<template>
    <transition name="fade">
        <div class="modal" v-show="showFlag">
            <div class="modal-content">
                <div class="title" v-show="title">
                    <div class="back" v-if="hasback" @click.stop="backpage">
                        <span>返回</span>
                    </div>
                    <div class="close" @click.stop="hide">
                        <span>关闭</span>
                    </div>
                </div>
                <div class="content">
                    <slot></slot>
                </div>
            </div>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
export default {
    props: {
        hasback: {
            type: Boolean,
            default: false
        },
        title: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            showFlag: false
        };
    },
    methods: {
        show() {
            this.showFlag = true;
        },
        hide() {
            this.showFlag = false;
        },
        backpage() {
            this.$emit('backpage');
        }
    }
};
</script>

<style scoped lang="stylus">
.modal
    position: fixed
    top: 0
    right: 0
    bottom: 0
    left: 0
    z-index: 998
    box-sizing: border-box
    padding: 12px 16px
    background: rgba(0, 0, 0, 0.3)
    &.fade-enter-active
        animation: modal-fadein 0.3s
        .modal-content
            animation: modal-zoom 0.3s
    &.fade-leave-active
        animation: modal-fadein 0.3s reverse
        .modal-content
            animation: modal-zoom 0.3s reverse
    .modal-content
        width: 100%
        height: 100%
        background: #fff
        border-radius: 6px
        position: relative
        overflow: hidden
        .title
            width: 100%
            height: 36px
            display: flex
            border-bottom: 1px solid #d9d9d9
            box-sizing: border-box
            .back,.close
                flex: 1
                line-height: 36px
                box-sizing: border-box
                padding: 0 12px
                color: #333
            .close
                text-align: right
        .content
            width: 100%
            position: absolute
            bottom: 0
            top: 36px
            left: 0
            z-index: 999
            background: #fff
            transition: all 0.3s
@keyframes slide-in
    0%
        transform: translate3d(100%, 0, 0)
    100%
        transform: translate3d(0, 0, 0)
@keyframes modal-fadein
    0%
        opacity: 0
    100%
        opacity: 1
@keyframes modal-zoom
    0%
        transform: scale(0)
    50%
        transform: scale(1.01)
    100%
        transform: scale(1)
</style>
