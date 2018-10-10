<template>
	<transition name="slide">
		<div class="coupon-select" v-show="showFlag">
			<x-header :left-options="{backText: '', preventGoBack: true}" @on-click-back="hide">
				选择优惠券
				<a @click="confirmCoupon" slot="right" style="font-size: 18px;color: black;">提交</a>
			</x-header>
			<scroll :data="couponList" ref="couponscroll" class="coupon-scroll">
				<couponItem v-for="item in couponList"
					:couponType="2"
					:couponInfo="item"
					:currentCoupon="currentCoupon"
					:key="item.id"
					@select="selectCoupon"
					@refreshScroll="refreshScroll">
				</couponItem>
			</scroll>
		</div>
	</transition>
</template>

<script type="text/ecmascript-6">
	import { XHeader } from 'vux';
	import couponItem from '@/components/base/coupon-item/coupon-item';
	import Scroll from '@/components/base/scroll/scroll';
	import { mapGetters } from 'vuex';

	export default {
		props: {
			couponList: {
				type: Array,
				defatul: []
			}
		},
		data () {
			return {
				showFlag: false,
				currentCoupon: -1
			};
		},
		methods: {
			show() {
				this.showFlag = true;
				setTimeout(() => {
					this.$refs.couponscroll.refresh();
				}, 60);
			},
			hide() {
				this.showFlag = false;
				if (!this.couponId) {
					this.currentCoupon = -1;
				}
			},
			confirmCoupon() {
				this.showFlag = false;
				this.$emit('select', this.currentCoupon);
			},
			selectCoupon(id) {
				if (id === this.currentCoupon) {
					this.currentCoupon = -1;
				} else {
					this.currentCoupon = id;
				}
			},
			refreshScroll() {
				this.$refs.couponscroll.refresh();
			}
		},
		computed: {
			...mapGetters([
				'couponId'
			])
		},
		components: {
			couponItem,
			Scroll,
			XHeader
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.coupon-select
	width: 100%
	position: absolute
	top: 0
	left: 0
	bottom: 0
	background: #f6f6f6
	.coupon-scroll
		position: absolute
		top: 46px
		bottom: 0
		left: 0
		width: 100%
		overflow: hidden
.slide-enter-active, .slide-leave-active
	transition: all 0.3s
.slide-enter, .slide-leave-to
	transform: translate3d(100%, 0, 0)
</style>