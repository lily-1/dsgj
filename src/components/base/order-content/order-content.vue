<template>
	<div class="content">
		<div class="order-good">
			<img class="order-goodavatar" v-if="orderInfo" v-lazy="orderInfo.goodsPic" />
			<div class="order-goodinfo">
				<div class="good-name" v-if="orderInfo">{{ orderInfo.goodsName }}</div>
				<div class="good-sku">
					<p class="good-skuname" v-if="orderInfo">{{ orderInfo.skuContent }}</p>
				</div>
				<div class="good-number">
					<span class="good-price" v-if="orderInfo">￥{{ orderInfo.sellPrice }}</span>
					<span class="good-count" v-if="orderInfo">x{{ orderInfo.productNum }}</span>
				</div>
			</div>
		</div>
		<div class="order-price" v-if="orderInfo">
			<p>共计<span>{{ orderInfo.productNum }}</span>件商品 金额 : <span>￥{{ orderAmount}}</span></p>
		</div>
		<div class="order-info" v-if="userInfo">
			<p>
				<span><img src="./img/icon_user@2x.png">姓名</span>
				<span>{{ userInfo.nickname }}</span>
			</p>
			<p>
				<span><img src="./img/icon_phone@2x.png">手机号</span>
				<span>{{ userInfo.mobilePhone }}</span>
			</p>
			<p>
				<span><img src="./img/icon_paytype@2x.png">支付方式</span>
				<span>微信支付</span>
			</p>
		</div>
		<div class="remark">
			<x-textarea @on-focus="onFocus" class="remark-textarea" placeholder="这里可以备注信息" v-model="remark" :height="100" :max="150"></x-textarea>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
	import { getMemberInfo } from '@/api/usercenter';
	import { XTextarea } from 'vux';
	import { errfun } from '@/common/js/util';
	import { mapGetters } from 'vuex';

	export default{
		props: {
			orderInfo: {
				type: Object,
				default: null
			}
		},
		data() {
			return {
				remark: '',
				userInfo: {}
			};
		},
		methods: {
			onFocus() {
				this.$emit('focus');
			},
			async initData() {
				let memberInfoResult = await getMemberInfo();
				if (!memberInfoResult.code) {
					this.userInfo = memberInfoResult.result;
				} else {
					errfun(this, this.$router, memberInfoResult.code, memberInfoResult.message);
				}
			}
		},
		created() {
			console.log('created');
			this.initData();
		},
		watch: {
			accessToken(val) {
				console.log(val);
				this.initData();
			}
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
				'accessToken'
			])
		},
		components: {
			XTextarea
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.content
	width: 100%
	height: auto
	overflow: hidden
	.order-good
		width: 100%
		display: flex
		box-sizing: border-box
		padding: 12px 8px 25px
		background: #fafafa
		.order-goodavatar
			flex: 0 0 96px
			width: 96px
			height: 96px
			margin-right: 10px
		.order-goodinfo
			flex: 1
			overflow: hidden
			font-size: 14px
			.good-name
				width: 100%
				height: 44px
				line-height: 22px
				text-overflow: ellipsis
				display: -webkit-box
				-webkit-box-orient: vertical
				-webkit-line-clamp: 2
				overflow: hidden
				margin-bottom: 10px
				font-weight: 600
				color: #333
			.good-sku
				width: 100%
				height: 18px
				margin-bottom: 8px
				.good-skuname
					vertical-align: top
					line-height: 18px
					color: #989898
					overflow: hidden
					white-space: nowrap
					text-overflow: ellipsis
					width: 100%
			.good-number
				width: 100%
				height: 16px
				display: flex
				span
					flex: 1
				.good-price
					color: #fe3f51
				.good-count
					color: #999
					text-align: right
	.order-price
		width: 100%
		line-height: 16px
		text-align: right
		font-size: 14px
		box-sizing: border-box
		padding: 14px 8px
		background: #fff
		border-top: 1px solid #e9e9e9
		color: #989898
		span
			color: #fe3f51
	.order-info
		width: 100%
		background: #fff
		p
			width: 100%
			height: 40px
			vertical-align: middle
			display: -webkit-box
			display: -ms-flexbox
			display: flex
			font-size: 0
			-webkit-box-sizing: border-box
			box-sizing: border-box
			padding: 0 8px
			.coupon-number
				color: #fe3f51
				background: url(./img/icon_right.jpg) no-repeat right center
				background-size: 7px 12px
				box-sizing: border-box
				padding-right: 12px
			img
				vertical-align: middle
				width: 15px
				height: 15px
				margin-right: 12px
			span
				flex: 1
				font-size: 14px
				line-height: 40px
				vertical-align: top
				&:nth-child(2)
					text-align: right
					overflow: hidden
					text-overflow: ellipsis
					white-space: nowrap
		p:nth-child(1)
			img
				width: 13px
		p:nth-child(2)
			img
				width: 12px
		p:nth-child(3)
			img
				height: 13px
	.remark
		background: #fff
		.weui-cell__bd
			background: #f8f8f8
			font-size: 14px
			color: #999
			padding: 8px
		.weui-textarea
			background: #f8f8f8
			padding: 0px
		.weui-textarea::-webkit-input-placeholder
			color: #999 !important
		.vux-x-textarea
			padding: 8px
</style>