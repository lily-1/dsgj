<template>
    <transition name="slide">
        <div class="order-comment" v-show="showflag">
            <x-header :left-options="{backText: '', preventGoBack: true}" @on-click-back="back">{{ type === 0 ? '商品' : '服务' }} 评价</x-header>
            <div class="order-info" v-if="type === 0">
                <div class="good-avatar">
                    <img v-lazy="picurl + data.goodsCoverPicturePath" class="avatar" :key="data.id" />
                </div>
                <div class="good-name">{{ data.goodsName }}</div>
            </div>
            <div class="order-level">
                <div class="title">综合评价</div>
                <div class="level">
                    <div class="level-item" @click="chioce('GOOD')" :class="{'active': level === 'GOOD'}">
                        <div class="icon icon-good">好评</div>
                    </div>
                    <div class="level-item" @click="chioce('MIDDLE')" :class="{'active': level === 'MIDDLE'}">
                        <div class="icon icon-middle">中评</div>
                    </div>
                    <div class="level-item" @click="chioce('BAD')" :class="{'active': level === 'BAD'}">
                        <div class="icon icon-bad">差评</div>
                    </div>
                </div>
            </div>
            <div class="comment-box">
                <div class="comment">
                    <group>
                        <x-textarea :height="100" v-model="comment" :max="50"></x-textarea>
                    </group>
                </div>
            </div>
            <div class="comment-submit">
                <m-button class="btnsubmit" @clickBtn="submitComment" ref="submitComment">提交</m-button>
            </div>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
import { XHeader, XTextarea, Group } from 'vux';
import MButton from '@/components/base/m-button/m-button';
import { commentOrder } from '@/api/order';
import { PICURL } from '@/common/js/config';

export default {
    props: {
        data: {
            type: Object,
            default: null
        },
        /**
         * 区分是订单评价，消费记录评价
         * 0为订单评价
         * 1为消费记录评价
         */
        type: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            level: '',
            comment: '',
            showflag: false,
            orderdata: {},
            placeholder: '请输入您的评价内容(评价内容不超过50个字)',
            picurl: PICURL
        };
    },
    created() {
        console.log(this.data);
    },
    methods: {
        show() {
            this.showflag = true;
        },
        hide() {
            this.showflag = false;
        },
        back() {
            this.showflag = false;
        },
        chioce(level) {
            this.level = level;
        },
        async submitComment() {
            let that = this;
            let id = this.data.id || this.data.consumeSourceId;
            if (this.level === '') {
                this.$vux.alert.show({
                    content: '请选择综合评价',
                    onHide() {
                        that.$refs.submitComment.complete();
                    }
                });
                return;
            }
            let result = await commentOrder(id, this.comment, this.level);
            if (result) {
                this.$vux.alert.show({
                    content: '评价成功',
                    onHide: () => {
                        this.showflag = false;
                        this.comment = '';
                        this.level = '';
                        this.$emit('comment');
                    }
                });
            }
            this.$refs.submitComment.complete();
        }
    },
    components: {
        XHeader,
        XTextarea,
        MButton,
        Group
    }
};
</script>

<style scoped lang="stylus">
.order-comment
    width: 100%
    position: fixed
    top: 0
    left: 0
    bottom: 0
    background: #fff
    z-index: 99
    .order-info
        width: 100%
        padding: 15px 10px
        display: flex
        background: #fafafa
        box-sizing: border-box
        .good-avatar
            flex: 0 0 75px
            width: 75px
            height: 75px
            .avatar
                width: 100%
                height: 100%
        .good-name
            flex: 1
            height: 50px
            line-height: 25px
            overflow: hidden
            text-overflow: ellipsis
            display: -webkit-box
            -webkit-line-clamp: 2
            box-sizing: border-box
            padding-left: 20px
    .order-level
        width: 100%
        box-sizing: border-box
        padding: 20px 10px
        height: auto
        overflow: hidden
        display: flex
        .title
            flex: 0 0 80px
            width: 80px
            line-height: 24px
        .level
            flex: 1
            height: 24px
            line-height: 24px
            display: flex
            .level-item
                flex: 1
                text-align: center
                .icon
                    display: inline-block
                    padding-left: 30px
                .icon-good
                    background: url('./img/icon_good@2x.png') no-repeat left center
                    background-size: 20px 22px
                .icon-middle
                    background: url('./img/icon_middle@2x.png') no-repeat left center
                    background-size: 20px 22px
                .icon-bad
                    background: url('./img/icon_bad@2x.png') no-repeat left center
                    background-size: 20px 22px
            .active
                .icon-good
                    background: url('./img/icon_good_active@2x.png') no-repeat left center
                    background-size: 20px 22px
                .icon-middle
                    background: url('./img/icon_middle_active@2x.png') no-repeat left center
                    background-size: 20px 22px
                .icon-bad
                    background: url('./img/icon_bad_active@2x.png') no-repeat left center
                    background-size: 20px 22px
    .comment-box
        padding: 10px
        .comment
            width: 100%
            height: 100%
            .weui-cell
                padding: 10px 4px
                border: 1px solid #ccc
            .weui-cells
                margin-top: 0px
                &:before
                    border-top: none
                    margin-top: 0px
                textarea
                    font-family: "微软雅黑"
                    font-size: 14px
    .comment-submit
        width: 100%
        height: 40px
        line-height: 40px
        margin-top: 20px
        box-sizing: border-box
        padding: 0 10px
        .btnsubmit
            width: 100%
            height: 100%
            text-align: center
            color: #ffffff
            border-radius: 20px
            background: #fe3f51
    .slide-enter, .slide-leave-to
        transform: translate3d(100%, 0, 0)
    .slide-enter-active, .slide-leave-active
        transition: all 0.3s
</style>
