<template>
	<transition name="slide">
		<div class="store-coupon-list">
			<x-header :left-options="{backText: ''}">优惠券</x-header>
			<scroll class="coupon-list-content" ref="couponlist" :data="couponList" :pullup="pullup" :pulldown="pulldown" @pulldown="refresh" @pullup="getMoreCoupon">
				<couponItem ref="coupon" v-for="(item, index) in couponList" :key="item.id" :keys="index" :couponInfo="item" @receive="receive"></couponItem>
			</scroll>
		</div>
	</transition>
</template>

<script type="text/ecmascript-6">
	import Scroll from '@/components/base/scroll/scroll';
	import CouponItem from '@/components/base/coupon-item/coupon-item';
	import { getStoreCouponList, receiveCoupon } from '@/api/index';
	import { mapGetters } from 'vuex';
	import { XHeader } from 'vux';

	export default {
		created() {
			// if (!this.storeId) {
			// 	return;
			// }
			// this.getCouponList();
		},
		methods: {
			async receive(id, name, index) {
				let receiveResult = await receiveCoupon(id);
				if (receiveResult) {
					let that = this;
					this.$vux.confirm.show({
						title: '领取成功！',
						content: '您已获取' + name,
						confirmText: '知道了',
						cancelText: '去首页',
						onCancel () {
							that.$router.push({
								path: '/index'
							});
						}
					});
				}
				this.$refs.coupon[index].$refs.btnreceive.complete();
			},
			async getCouponList() {
				let couponResult = await getStoreCouponList(this.storeId, this.pageNum, this.pageSize);
				this.couponList = couponResult.content;
				this.checkMore(couponResult);
			},
			refresh() {
				this.pageNum = 0;
				setTimeout(() => {
					this.getCouponList();
				}, 1000);
			},
			getMoreCoupon() {
				if (!this.loadMore && this.$refs.couponlist) {
					this.$refs.couponlist.forceUpdate(true);
					return;
				}
				this.pageNum++;
				setTimeout(async () => {
					let couponResult = await getStoreCouponList(this.storeId, this.pageNum, this.pageSize);
					this.couponList = this.couponList.concat(couponResult.content);
					this.checkMore(couponResult);
					this.$vux.loading.hide();
				}, 1000);
			},
			checkMore(data) {
				this.loadMore = !data.isLast;
				if (this.$refs.couponlist) {
					this.$refs.couponlist.forceUpdate(data.isLast);
				}
			}
		},
		data () {
			return {
				couponList: [],
				pageSize: 8,
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
		watch: {
			storeId(storeid) {
				if (!storeid) {
					return;
				}
				this.getCouponList();
			}
		},
		computed: {
			...mapGetters([
				'storeId'
			])
		},
		components: {
			XHeader,
			Scroll,
			CouponItem
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.store-coupon-list
	width: 100%
	position: fixed
	top: 0
	bottom: 0
	left: 0
	z-index: 3
	background: #f6f6f6
	.coupon-list-content
		position: absolute
		top: 47px
		left: 0
		bottom: 0
		width: 100%
.slide-enter-active, .slide-leave-active
	transition: all 0.3s
.slide-enter, .slide-leave-to
	transform: translate3d(100%, 0, 0)
</style>