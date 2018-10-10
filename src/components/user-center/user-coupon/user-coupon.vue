<template>
    <transition name="slide">
        <div class="user-coupon">
            <x-header :left-options="{backText: ''}">我的优惠券</x-header>
            <div class="user-coupon-tab">
                <div class="coupon-type" :class="{'active': type === 'unUsed'}" @click="coupontype('unUsed')">
                    <span class="text">未使用</span>
                </div>
                <div class="coupon-type" :class="{'active': type === 'used'}" @click="coupontype('used')">
                    <span class="text">已使用</span>
                </div>
                <div class="coupon-type" :class="{'active': type === 'expiry'}" @click="coupontype('expiry')">
                    <span class="text">已过期</span>
                </div>
            </div>
            <scroll class="scrollcoupon" :data="couponList" :pullup="pullup" :pulldown="pulldown" @pulldown="refresh" @pullup="getMoreCoupon" ref="scrollcoupon">
                <coupon-item  v-for="item in couponList"
                    :key="item.id"
                    :couponInfo="item"
                    :couponType="couponType">
                </coupon-item>
            </scroll>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
import { XHeader } from 'vux';
import { getUserCoupon } from '@/api/usercenter';
import Scroll from '@/components/base/scroll/scroll';
import CouponItem from '@/components/base/coupon-item/coupon-item';
// import { routerMixin } from '@/common/js/mixin';

const PAGE_SIZE = 8;

export default {
    // mixins: [routerMixin],
    methods: {
        async initData() {
            this.pageNum = 0;
            let couponResult = await getUserCoupon(this.type, PAGE_SIZE, this.pageNum);
            // console.log(couponResult);
            if (!couponResult) {
                return;
            }
            this.couponList = couponResult.content;
            this.checkMore(couponResult);
        },
        coupontype(type) {
            switch (type) {
                case 'unUsed':
                    this.couponType = 3;
                    break;
                case 'used':
                    this.couponType = 4;
                    break;
                case 'expiry':
                    this.couponType = 5;
                    break;
            }
            this.type = type;
            this.initData();
        },
        refresh() {
            this.pageNum = 0;
            setTimeout(() => {
                this.initData();
            }, 1000);
        },
        checkMore(data) {
            this.loadMore = !data.isLast;
            this.$refs.scrollcoupon.forceUpdate(data.isLast);
        },
        getMoreCoupon() {
            if (!this.loadMore) {
                this.$refs.scrollcoupon.forceUpdate(true);
                return;
            }
            this.pageNum++;
            setTimeout(async () => {
                let couponResult = await getUserCoupon(this.type, PAGE_SIZE, this.pageNum);
                this.couponList = this.couponList.concat(couponResult.content);
                this.checkMore(couponResult);
            }, 1000);
        }
    },
    created() {
        // this.initData();
    },
    data() {
        return {
            couponType: 3,
            type: 'unUsed',
            couponList: [],
            pageNum: 0,
            pullup: {
                threshold: 50,
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
        CouponItem
    }
};
</script>

<style scoped lang="stylus">
.user-coupon
    width: 100%
    position: fixed
    top: 0
    bottom: 0
    left: 0
    background: #f6f6f6
    z-index: 99
    .user-coupon-tab
        width: 100%
        height: 34px
        display: flex
        background: #fff
        .coupon-type
            flex: 1
            text-align: center
            line-height: 34px
            .text
                color: #333
                margin: 0 auto
                height: 100%
                display: inline-block
                box-sizing: border-box
        .active
            .text
                color: #fe3f51
                border-bottom: 4px solid #fe3f51
    .scrollcoupon
        width: 100%
        position: absolute
        top: 80px
        left: 0
        bottom: 0
        overflow: hidden
.slide-enter, .slide-leave-to
	transform: translate3d(100%, 0, 0)
.slide-enter-active, .slide-leave-active
	transition: all 0.3s
</style>
