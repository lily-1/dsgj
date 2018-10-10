<template>
    <transition name="slide">
        <div class="order-list">
            <x-header :left-options="{backText: ''}">线上订单</x-header>
            <ul class="tab">
                <li class="item" :class="{'active': type == 0}" @click="changeType(0)">全部</li>
                <li class="item" :class="{'active': type == 'UNPAID'}" @click="changeType('UNPAID')">待付款</li>
                <li class="item" :class="{'active': type == 'PAID'}" @click="changeType('PAID')">待发货</li>
                <li class="item" :class="{'active': type == 'SENT'}" @click="changeType('SENT')">待收货</li>
                <li class="item" :class="{'active': type == 'COMPLETED'}" @click="changeType('COMPLETED')">待评价</li>
            </ul>
            <scroll class="order-list-content" ref="orderlist"
                :data="orderList"
                :pullup="pullup"
                :pulldown="pulldown"
                @pulldown="refresh"
                @pullup="getMoreOrder">
                <order-item ref="orderItem" v-for="(item, index) in orderList"
                     :data="item"
                     :key="item.id"
                     @cancel="cancelconfirm(item.id, index)"
                     @paid="paid(item.id, index)"
                     @recived="recivedconfirm(item.id, index)"
                     @comment="toComment(item)">
                </order-item>
            </scroll>
            <orderComment ref="ordercomment" :data="orderdata" @comment="refresh"></orderComment>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
import Scroll from '@/components/base/scroll/scroll';
import OrderItem from '@/components/base/order-item/order-item';
import OrderComment from '@/components/user-center/user-order-comment/user-order-comment';
import { wechatMixin, routerMixin } from '@/common/js/mixin';
import { getUserOrderList, cancelOrder, recivedOrder } from '@/api/order';
import { payWechat } from '@/api/product';
import { XHeader } from 'vux';

const PAGE_SIZE = 8;

export default {
    mixins: [wechatMixin, routerMixin],
    methods: {
        toComment(data) {
            this.orderdata = data;
            this.$refs.ordercomment.show();
        },
        async cancelOrder(id) {
            let cancelResult = await cancelOrder(id);
            console.log(cancelResult);
            this.refresh();
        },
        async recived(id) {
            let recivedResult = await recivedOrder(id);
            console.log(recivedResult);
            this.refresh();
        },
        async paid(id, index) {
            if (!this.publicId) {
                return;
            }
            let that = this;
            // 配置微信wx.config, 返回wx对象
            let wx = await this.getWxObject();
            wx.ready(async () => {
                // 支付配置
                let payResult = await payWechat(id);
                wx.chooseWXPay({
                    debug: true,
                    'timestamp': payResult.timeStamp, // 时间戳,自1970年以来的秒数
                    'nonceStr': payResult.nonceStr, // 随机串
                    'package': payResult.package,
                    'signType': 'MD5', // 微信签名方式
                    'paySign': payResult.paySign, // 微信签名
                    success: function (res) {
                        // 支付成功后的回调函数
                        that.$vux.alert.show({
                            content: '支付成功',
                            onHide () {
                                that.refresh();
                            }
                        });
                    },
                    cancel: function() {
                        that.$vux.alert.show({
                            content: '微信支付取消了'
                        });
                    },
                    fail: function(res) {
                        console.log(res);
                        that.$vux.alert.show({
                            content: '微信支付配置出错'
                        });
                    }
                });
                that.$refs.orderItem[index].$refs.payBtn.complete();
            });
        },
        cancelconfirm(id, index) {
            let that = this;
            this.$vux.confirm.show({
                title: '提示',
                content: '确认删除订单吗？',
                onConfirm () {
                    that.cancelOrder(id);
                },
                onHide() {
                    that.$refs.orderItem[index].$refs.cancelBtn.complete();
                }
            });
        },
        recivedconfirm(id, index) {
            let that = this;
            this.$vux.confirm.show({
                title: '提示',
                content: '是否确认收货？',
                onConfirm () {
                    that.recived(id);
                },
                onHide() {
                    that.$refs.orderItem[index].$refs.recivedBtn.complete();
                }
            });
        },
        changeType(type) {
            this.type = type !== 0 ? type : '';
            this.pageNum = 0;
            this.getOrder();
        },
        getMoreOrder() {
            if (!this.loadMore) {
                this.$refs.orderlist.forceUpdate(true);
                return;
            }
            this.pageNum++;
            setTimeout(async () => {
                let orderListResult = await getUserOrderList(this.type, this.pageNum, PAGE_SIZE);
                this.orderList = this.orderList.concat(orderListResult.content);
                this.checkMore(orderListResult);
            }, 1000);
        },
        refresh() {
            this.pageNum = 0;
            this.getOrder();
        },
        async getOrder() {
            let orderListResult = await getUserOrderList(this.type, this.pageNum, PAGE_SIZE);
            if (!orderListResult) {
                return;
            }
            this.orderList = orderListResult.content;
            this.checkMore(orderListResult);
        },
        checkMore(data) {
            this.loadMore = !data.isLast;
            this.$refs.orderlist.forceUpdate(data.isLast);
        },
        initData() {
            this.type = this.$route.query.type !== '0' ? this.$route.query.type : '';
            this.getOrder();
        }
    },
    beforeRouteLeave (to, from, next) {
        if (this.$refs.ordercomment.showflag) {
            this.$refs.ordercomment.hide();
        } else {
            next();
        }
    },
    data() {
        return {
            orderdata: {},
            type: 0,
            orderList: [],
            pageNum: 0,
            pullup: {
                threshold: 20,
                stop: 40
            },
            pulldown: {
                threshold: 50,
                stop: 40
            }
        };
    },
    components: {
        XHeader,
        Scroll,
        OrderItem,
        OrderComment
    }
};
</script>

<style scoped lang="stylus">
.order-list
    width: 100%
    position: fixed
    top: 0
    bottom: 0
    left: 0
    background: #f0f1f3
    z-index: 99
    /*===选项卡==*/
    .tab
        width: 100%
        height: 60px
        line-height: 60px
        display: flex
        background: #fe3f51
        .item
            flex: 1
            text-align: center
            color: #fff
        .active
            background: url(./img/active.png) no-repeat center bottom
            background-size: 100% 20%
            color: #fee12b
    /*===订单列表====*/
    .order-list-content
        width: 100%
        position: absolute
        top: 106px
        bottom: 0
        left: 0
        overflow: hidden
.slide-enter, .slide-leave-to
	transform: translate3d(100%, 0, 0)
.slide-enter-active, .slide-leave-active
	transition: all 0.3s
</style>
