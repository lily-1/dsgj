<template>
    <div class="user-center">
        <scroll class="user-center-content" ref="usercenter">
            <div class="user-card">
                <div class="user-card-box">
                    <div class="background">
                        <img class="bg-image" src="./img/bg-card@2x.png" />
                    </div>
                    <div class="user-cardcontent" v-if="userlogin">
                        <img class="user-avatar" v-lazy="memberInfo.headimgurl" />
                        <div class="user-info">
                            <div class="user-name" v-if="memberInfo && memberInfo.nickname">{{ memberInfo.nickname }}</div>
                            <div class="user-account">
                                <span class="user-balance" v-if="memberInfo.hasCustomer">
                                    余额<span class="number">￥{{ userInfo.balance }}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="user-notlogged" v-else>
                        <img class="user-avatar-default" src="./img/icon_avatardef@2x.png" />
                        <div class="user-info">
                            <img src="./img/icon_loginbtn@2x.png" class="btn-login" @click="toLogin">
                            <p class="text">亲,绑定后才能查询订单信息</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="user-order">
                <div class="title">
                    <div class="text">
                        线上订单
                    </div>
                    <div class="btnList" @click="toOrder(0)">
                        <p>全部订单</p>
                        <span class="icon_right"></span>
                    </div>
                </div>
                <ul class="order-tab">
                    <li class="order-type" @click="toOrder('UNPAID')">
                        <img class="icon-order-type" src="./img/icon_unpaid@2x.png" alt="" />
                        <p>待付款</p>
                    </li>
                    <li class="order-type" @click="toOrder('PAID')">
                        <img class="icon-order-type" src="./img/icon_paid@2x.png" alt="" />
                        <p>待发货</p>
                    </li>
                    <li class="order-type" @click="toOrder('SENT')">
                        <img class="icon-order-type" src="./img/icon_receipt@2x.png" alt="" />
                        <p>待收货</p>
                    </li>
                    <li class="order-type" @click="toOrder('COMPLETED')">
                        <img class="icon-order-type" src="./img/icon_evaluated@2x.png" alt="" />
                        <p>待评价</p>
                    </li>
                </ul>
            </div>
            <div class="user-record" v-if="memberInfo.hasCustomer">
                <router-link tag="div" class="record-item" :to="{path: '/remainCombo'}">
                    <div class="icon-box">
                        <img class="icon" src="./img/icon_combo@2x.png" alt="">
                    </div>
                    <p class="text">剩余套餐</p>
                </router-link>
                <router-link tag="div" class="record-item" :to="{path: '/userCoupon'}">
                    <div class="icon-box">
                        <img class="icon" src="./img/icon_coupon@2x.png" alt="">
                    </div>
                    <p class="text">电子券</p>
                </router-link>
                <router-link tag="div" class="record-item" :to="{path: '/consumeRecord'}">
                    <div class="icon-box">
                        <img class="icon" src="./img/icon_consum@2x.png" alt="">
                    </div>
                    <p class="text">消费记录</p>
                </router-link>
                <router-link tag="div" class="record-item" :to="{path: '/subscribeRecord'}">
                    <div class="icon-box">
                        <img class="icon" src="./img/icon_appointment@2x.png" alt="">
                    </div>
                    <p class="text">预约记录</p>
                </router-link>
            </div>
            <div class="user-setting" v-if="memberInfo.hasCustomer">
                <div class="title">
                    <div class="text">
                        设置管理
                    </div>
                </div>
                <div class="setting-content">
                    <router-link tag="div" class="setting-item" :to="{path: '/userSetting'}">
                        <img class="icon" src="./img/icon_person@2x.png" />
                        <p class="text">个人资料</p>
                    </router-link>
                    <router-link tag="div" class="setting-item" :to="{path: '/userCompleteCarinfo'}">
                        <img class="icon" src="./img/icon_car@2x.png" />
                        <p class="text">完善车辆</p>
                    </router-link>
                </div>
            </div>
        </scroll>
        <router-view></router-view>
    </div>
</template>

<script type="text/ecmascript-6">
import Scroll from '@/components/base/scroll/scroll';
import { getMemberInfo, getUserInfo } from '@/api/usercenter';
import { errfun } from '@/common/js/util';
import { mapGetters } from 'vuex';
import { routerMixin } from '@/common/js/mixin';

export default {
    mixins: [routerMixin],
    methods: {
        async initData() {
            let memberResult = await getMemberInfo();
            if (!memberResult.code) {
                this.memberInfo = memberResult.result;
                this.userlogin = true;
                if (!this.memberInfo.hasCustomer) {
                    return;
                }
                // 获取客户
                let userInfoResult = await getUserInfo();
                if (!userInfoResult.code) {
                    this.userInfo = userInfoResult.result;
                } else {
                    errfun(this, this.$router, userInfoResult.code, userInfoResult.message);
                }
            } else {
                if (memberResult.code === 9004 || memberResult.code === 9005) {
                    this.userlogin = false;
                }
            }
        },
        toOrder(type) {
            this.$router.push({
                path: '/UserOrderList',
                query: {
                    type: type
                }
            });
        },
        toLogin() {
            this.$router.push({
                path: '/userLogin'
            });
        }
    },
    computed: {
        ...mapGetters([
            'accessToken'
        ])
    },
    watch: {
        accessToken(newtoken) {
            this.initData();
        }
    },
    data() {
        return {
            memberInfo: {},
            userInfo: {},
            userlogin: false
        };
    },
    components: {
        Scroll
    }
};
</script>

<style scoped lang="stylus">
@import '~common/stylus/mixin'

.user-center
    width: 100%
    position: absolute
    top: 0
    bottom: 53px
    left: 0
    background: #fff
    .user-center-content
        position: absolute
        top: 0
        bottom: 0
        width: 100%
        left: 0
        .title
            width: 100%
            display: flex
            height: 20px
            line-height: 20px
            padding-bottom: 10px
            margin-bottom: 20px
            border-bottom: 1px solid #f2f2f2
            .text, .btnList
                box-sizing: border-box
            .text
                flex: 1
                font-size: 14px
                padding-left: 10px
                font-weight: 600
                color: #333
                background: url(./img/icon_title@2x.png) no-repeat left top
                background: auto 100%
            .btnList
                flex: 1
                padding-right: 18px
                background: url(./img/icon_right@2x.png) no-repeat right center
                background-size: 8px 13px
                text-align: right
                color: #999
        .user-card
            width: 100%
            padding: 10px
            height: 160px
            box-sizing: border-box
            .user-card-box
                border-radius: 10px
                position: relative
                width: 100%
                height: 100%
                .background
                    position: absolute
                    width: 100%
                    height: 100%
                    top: 0
                    left: 0
                    z-index: -1
                    .bg-image
                        width: 100%
                        height: 100%
                /*========用户未登录状态=========*/
                .user-notlogged, .user-cardcontent
                    width: 100%
                    height: 100%
                    display: flex
                    box-sizing: border-box
                    padding: 10px 20px
                    color: #fff
                    .user-avatar-default, .user-avatar
                        flex: 0 0 50px
                        width: 50px
                        height: 50px
                        border-radius: 50%
                    .user-info
                        flex: 1
                        box-sizing: border-box
                        padding-left: 16px
                        height: auto
                        min-height: 52px
                        overflow: hidden
                        .btn-login
                            width: 66px
                        .text
                            line-height: 28px
                /*========用户登录状态=========*/
                .user-cardcontent
                    .user-cardno
                        position: absolute
                        bottom: 20px
                        left: 20px
                    .user-info
                        .user-name
                            max-width: 100%
                            line-height: 28px
                        .user-account
                            max-width: 100%
                            line-height: 28px
                            word-wrap: break-word
                            .user-balance, .user-points
                                word-wrap: break-word
                                float: left
                                .number
                                    margin-left: 4px
                                    color: #fe3f51
                            .user-balance
                                margin-right: 6px
        /*========线上订单=========*/
        .user-order
            margin: 0 10px
            padding-bottom: 20px
            .order-tab
                width: 100%
                display: flex
                .order-type
                    flex: 1
                    .icon-order-type
                        display: block
                        width: 50px
                        margin: 0 auto 12px
                    p
                        text-align: center
        /*=====用户卡记录====*/
        .user-record
            width: 100%
            height: 72px
            border-top: 10px solid #f0f1f2
            border-bottom: 10px solid #f0f1f2
            display: flex
            .record-item
                flex: 1
                border-right: 1px solid #f2f2f2
                text-align: center
                .icon-box
                    width: 100%
                    height: 46px
                    display: flex
                    box-center()
                    .icon
                        width: 24px
                .text
                    line-height: 18px
        /*=====设置管理====*/
        .user-setting
            width: 100%
            height: auto
            overflow: hidden
            box-sizing: border-box
            padding: 10px
            .title
                margin-bottom: 6px
            .setting-item
                height: 32px
                line-height: 32px
                font-size: 14px
                width: 100%
                display: flex
                align-items: center
                .icon
                    flex: 0 0 16px
                    width: 16px
                    height: 16px
                .text
                    flex: 1
                    box-sizing: border-box
                    padding-left: 10px
</style>
