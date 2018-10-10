<template>
	<div class="coupon-item">
		<div class="content-box">
			<div class="coupon-info">
				<div class="content">
					<div class="coupon-money ellipsis">￥{{ couponInfo.faceValue }}</div>
					<div class="coupon-name">
						<span class="icon_money"></span>
						<p class="name ellipsis">{{ couponInfo.name }}</p>
					</div>
					<div class="coupon-time">{{ time }}</div>
				</div>
			</div>
			<div class="coupon-type box-center">
				<div class="content">
					<div class="coupon-condition ellipsis" v-if="couponInfo.type === 'CASH'">{{ condition }}</div>
					<div class="coupon-btn box-center"  v-if="couponType < 3">
						<m-button class="coupon-receive" ref="btnreceive"
							v-if="couponType === 1"
							@clickBtn="receive">
							领取
						</m-button>
						<div class="coupon-chiocebtn"
							:class="{'active': currentCoupon === couponInfo.id }" v-if="couponType === 2"
							@click="select">
						</div>
					</div>
					<div class="tip-rule" @click="showtip" v-if="couponInfo.remark">
						使用规则/范围
					</div>
					<div class="icon-box"  v-if="couponType >= 3">
						<div class="icon icon_unused" v-if="couponType === 3"></div>
						<div class="icon icon_used" v-if="couponType === 4"></div>
						<div class="icon icon_expiry" v-if="couponType === 5"></div>
					</div>
				</div>
			</div>
		</div>
		<!--优惠券规则-->
		<div class="coupon-rule" v-if="showTip && couponInfo.remark">
			{{ couponInfo.remark }}
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
	import MButton from '@/components/base/m-button/m-button';

	export default {
		props: {
			couponInfo: {
				type: Object,
				default: null
			},
			/*
			 * couponType标示不同类型优惠券
			 * 1.优惠券领取
			 * 2.优惠券选择
			 * 3.优惠券未使用
			 * 4.优惠券已使用
			 * 5.优惠券已过期
			 */
			couponType: {
				type: Number,
				default: 1
			},
			/*
			 * 当couponType为2时,标记是否使用该优惠券按钮
			 */
			currentCoupon: {
				type: Number,
				default: -1
			},
			keys: {
				type: Number,
				defatult: 0
			}
		},
		created () {
			if (!this.couponInfo) {
				return;
			}
			this.initData();
		},
		methods: {
			initData() {
				// 优惠券时间
				this.time = this.couponInfo.dateless ? '有效期:永久有效' : this.couponInfo.startDate + '~' + this.couponInfo.endDate;
				// 优惠券条件
				this.condition = this.couponInfo.minPrice > 0 ? '满' + this.couponInfo.minPrice + '元可用' : '任意金额可用';
			},
			// 领取优惠券
			receive() {
				this.$emit('receive', this.couponInfo.id, this.couponInfo.name, this.keys);
			},
			// 领取完成重置为可用
			complete() {
				this.$refs.btnreceive.complete();
			},
			select() {
				this.$emit('select', this.couponInfo.id);
			},
			showtip() {
				this.showTip = !this.showTip;
				this.$emit('refreshScroll');
			}
		},
		watch: {
			couponInfo() {
				if (!this.couponInfo) {
					return;
				}
				this.initData();
			}
		},
		data () {
			return {
				time: '',
				condition: '',
				showTip: false
			};
		},
		components: {
			MButton
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.coupon-item
	width: 100%
	height: auto
	box-sizing: border-box
	padding: 12px 8px 0
	color: #666
	overflow: hidden
	.content-box
		width: 100%
		height: auto
		overflow: hidden
		display: flex
		.coupon-info
			flex: 1
			background: url(./img/bg-left@2x.png) no-repeat
			background-size: 100% 100%
			padding: 0 8px 0 18px
			overflow: hidden
			.content
				width: 100%
				height: 100%
				.coupon-money
					width: 100%
					height: 36px
					line-height: 35px
					font-size: 18px
					color: #fe3f51
					background: url(./img/bg-border@2x.png) repeat-x center bottom
					background-size: 100% 1px
					margin-bottom: 6px
				.coupon-name
					width: 100%
					height: 24px
					display: flex
					line-height: 18px
					.icon_money
						display: inline-block
						vertical-align: top
						flex: 0 0 18px
						width: 18px
						height: 18px
						background: url(./img/icon_money@2x.png) no-repeat left center
						background-size: 16px 16px
						font-size: 0
					.name
						flex: 1
						font-size: 14px
				.coupon-time
					line-height: 18px
					color: #999
		.coupon-type
			flex: 0 0 110px
			width: 110px
			background: url(./img/bg-right@2x.png) no-repeat
			background-size: 110px 100%
			padding: 0 8px 0 6px
			box-sizing: border-box
			.coupon-btn
				height: 40px
				width: 100%
				.coupon-receive
					width: 60px
					height: 22px
					display: inline-block
					border-radius: 12px
					text-align: center
					line-height: 24px
					background: #fe3f51
					color: #fff
				.coupon-chiocebtn
					display: inline-block
					width: 20px
					height: 20px
					background: url(./img/icon_chioce@2x.png) no-repeat center center
					background-size: 20px 20px
					&.active
						background: url(./img/icon_chioce_active@2x.png) no-repeat center center
						background-size: 20px 20px
			.tip-rule
				font-size: 12px
			.icon-box
				width: 96px
				height: 60px
				.icon
					width: 100%
					height: 100%
					background: url(./img/icon_unused@2x.png) no-repeat center center
					background-size: 68px 50px
				.icon_expiry
					background: url(./img/icon_expiry@2x.png) no-repeat center center
					background-size: 68px 50px
				.icon_used
					background: url(./img/icon_used@2x.png) no-repeat center center
					background-size: 68px 50px
	.coupon-rule
		width: 100%
		height: auto
		line-height: 24px
		overflow: hidden
		border: 1px solid #d9d9d9
		border-top: 0
		padding: 2px 6px
		font-size: 14px
		word-break: break-all
		box-sizing: border-box
</style>