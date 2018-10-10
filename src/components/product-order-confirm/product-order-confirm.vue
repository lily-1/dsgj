<template>
	<transition name="slide">
		<div class="good-orderconfirm">
			<scroll class="order-content" ref="orderContentScroll">
				<x-header :left-options="{backText: ''}">确认订单</x-header>
				<orderContent
					ref="ordercontent"
					@focus="focus"
					:orderInfo="orderInfo">
				</orderContent>
			</scroll>
			<div class="order-bottom">
				<p class="price-sum">合计：<span>￥{{ orderAmount }}</span></p>
				<p class="btnbox">
					<m-button ref="paywechat" @clickBtn="orderconfirm">
						提交订单
					</m-button>
				</p>
			</div>
		</div>
	</transition>
</template>

<script type="text/ecmascript-6">
	import Scroll from '@/components/base/scroll/scroll';
	import MButton from '@/components/base/m-button/m-button';
	import OrderContent from '@/components/base/order-content/order-content';
	import { XHeader } from 'vux';
	import { mapGetters } from 'vuex';
	import { getOrderInfo, payWechat } from '@/api/product';
	import { wechatMixin, routerMixin } from '@/common/js/mixin';
	import { errfun } from '@/common/js/util';

	export default {
		mixins: [wechatMixin, routerMixin],
		methods: {
			async initData() {
				if (!this.orderInfo || !this.orderInfo.skuId || !this.orderInfo.productNum) {
					errfun(this, this.$router, 20001);
				}
			},
			async orderconfirm() {
				if (!this.publicId) {
					return;
				}
				let that = this;
				// 下单接口
				let orderResult = await getOrderInfo(this.orderInfo.skuId, this.orderInfo.productNum, this.$refs.ordercontent.remark);
				if (!orderResult) {
					return;
				}
				// 配置微信wx.config, 返回wx对象
				let wx = await this.getWxObject();
				wx.ready(async () => {
					// 支付配置
					let payResult = await payWechat(orderResult);
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
									that.$router.back();
								}
							});
						},
						cancel: function() {
							that.$vux.alert.show({
								content: '微信支付取消了',
								onHide () {
									that.$router.back();
								}
							});
						},
						fail: function(res) {
							console.log(res);
							that.$vux.alert.show({
								content: '微信支付配置出错'
							});
						}
					});
					that.$refs.paywechat.change();
				});
			},
			focus() {
				setTimeout(() => {
					this.$refs.orderContentScroll.refresh();
					this.$refs.orderContentScroll.scrollToBottom();
				}, 600);
			}
		},
		data () {
			return {
				result: {}
			};
		},
		computed: {
			orderAmount() {
				if (!this.orderInfo) {
					return;
				}
				let amount = (this.orderInfo.productNum * this.orderInfo.sellPrice).toFixed(2);
				return amount;
			},
			...mapGetters([
				'orderInfo'
			])
		},
		components: {
			Scroll,
			XHeader,
			MButton,
			OrderContent
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.good-orderconfirm
	width: 100%
	position: fixed
	top: 0
	bottom: 0
	left: 0
	z-index: 101
	background: #f0f1f2
	overflow: hidden
	.order-content
		width: 100%
		position: absolute
		top: 0
		left: 0
		bottom: 48px
	.order-bottom
		width: 100%
		height: 48px
		display: flex
		position: fixed
		bottom: 0
		box-sizing: border-box
		border-top: 1px solid #d9d9d9
		background: #fff
		p
			flex: 1
			line-height: 48px
		.price-sum
			box-sizing: border-box
			padding-left: 12px
			span
				color: #fe3f51
		.btnbox
			flex: 0 0 102px
			width: 102px
			.m-button
				background: #fe3f51
				width: 100%
				height: 100%
				text-align: center
				color: #fff
.slide-enter-active, .slide-leave-active
	transition: all 0.3s
.slide-enter, .slide-leave-to
	transform: translate3d(100%, 0, 0)
</style>