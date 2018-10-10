<template>
	<transition name="slide">
		<div class="about">
			<x-header :left-options="{backText: ''}">关于我们</x-header>
			<scroll ref="about" class="about-content">
				<div class="shop-banner">
					<img v-lazy="storeInfo.shopfrontImageUrl" />
				</div>
				<div class="shop-info">
					<img class="shop-avatar" src="./img/icon_avatar.png" />
					<div class="info">
						<div class="shop-name">
							<span class="icon_name"></span>
							<p class="name ellipsis">{{ storeInfo.name }}</p>
						</div>
						<p class="shop-manager">联系人: {{ storeInfo.contactName }} {{ storeInfo.businessTelephone }}</p>
					</div>
					<div class="shop-tell">
						<div class="call" @click="call"></div>
					</div>
				</div>
				<div class="shop-address" @click="toMap" v-if="storeInfo &&storeInfo.detailAddress">
					<span class="icon_address"></span>
					<p class="address">{{ storeInfo.detailAddress }}</p>
				</div>
				<div class="shop-desc">
					<p class="shop-desctitle">店面风采</p>
					<div class="shop-desccontent" v-for="(item, index) in storeDesc" :key="index">
						<p v-if="item.type=='text'" class="text">{{ item.value }}</p>
						<img v-else v-lazy="item.value" class="image" @load="successload" />
					</div>
				</div>
			</scroll>
			<actionsheet v-model="showmobile" :menus="menus" show-cancel></actionsheet>
		</div>
	</transition>
</template>

<script type="text/ecmascript-6">
	import Scroll from '@/components/base/scroll/scroll';
	import { wechatMixin } from '@/common/js/mixin';
	import { getStoreInfo } from '@/api/index';
	import { XHeader, Actionsheet } from 'vux';

	export default {
		mixins: [wechatMixin],
		methods: {
			async initData() {
				let storeResult = await getStoreInfo(this.storeId);
				// 门店信息接口
				this.storeInfo = storeResult;
				// 电话号码数组更新
				this.menus.length = 0;
				// 放置联系门店手机号
				let phoneObj = {};
				phoneObj.label = '<a href="tel:' + this.storeInfo.businessTelephone + '" style="width:100%;height:100%;display:inline-block"><span style="color:#1aabff;font-size:18px;">' + this.storeInfo.businessTelephone + '</span></a>';
				this.menus.push(phoneObj);
				if (this.storeInfo && this.storeInfo.introduce) {
					try {
						if (typeof JSON.parse(this.storeInfo.introduce) === 'object') {
							this.isJson = true;
						}
					} catch (e) {
						console.log(e);
					}
					if (this.isJson) {
						this.storeDesc = JSON.parse(this.storeInfo.introduce);
						// console.log(this.storeDesc);
					}
				}
			},
			call () {
				this.showmobile = true;
			},
			successload() {
				this.$refs.about.refresh();
			}
		},
		created() {
			if (!this.storeId) {
				return;
			}
			this.initData();
		},
		data () {
			return {
				storeInfo: {},
				menus: [],
				storeDesc: [],
				showmobile: false
			};
		},
		watch: {
			storeId(storeid) {
				if (!storeid) {
					return;
				}
				this.initData();
			}
		},
		components: {
			Scroll,
			XHeader,
			Actionsheet
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.about
	width: 100%
	position: fixed
	top: 0
	left: 0
	bottom: 0
	background: #f0f1f2
	z-index: 99
	.about-content
		width: 100%
		position: absolute
		top: 47px
		bottom: 0
		left: 0
		overflow: hidden
		.shop-banner
			width: 100%
			height: 0
			position: relative
			padding-top: 80%
			overflow: hidden
			img
				position: absolute
				top: 0
				bottom: 0
				width: 100%
				height: 100%
				display: inline-block
		.shop-info
			width: 100%
			height: 81px
			box-sizing: border-box
			padding: 16px 9px
			display: flex
			border-bottom: 1px solid #e9e9e9
			background: #fff
			.shop-avatar
				flex: 0 0 46px
				width: 46px
				border-radius: 50%
			.info
				flex: 1
				padding-left: 12px
				box-sizing: border-box
				overflow: hidden
				.shop-name, .shop-manager
					width: 100%
					height: 24px
					font-size: 14px
					line-height: 24px
				.shop-name
					display: flex
					.icon_name
						flex: 0 0 20px
						width: 20px
						height: 24px
						background: url(./img/icon_name.png) no-repeat left center
						background-size: 16px 16px
			.shop-tell
				flex: 0 0 64px
				width: 64px
				justify-content: space-between
				justify-content: center
				align-items: center
				text-align: center
				font-size: 14px
				display: flex
				.call
					width: 100%
					height: 20px
					background: url(./img/icon_tell.png) no-repeat
					background-size: 100% 20px
		.shop-address
			width: 100%
			height: 36px
			display: flex
			background: #fff
			margin-bottom: 10px
			.icon_address
				flex: 0 0 32px
				width: 32px
				display: inline-block
				background: url(./img/icon_address.png) no-repeat center center
				background-size: 12px 16px
			.address
				flex: 1
				line-height: 36px
				text-overflow: ellipsis
				overflow: hidden
				white-space: nowrap
		.shop-desc
			width: 100%
			height: auto
			overflow: hidden
			background: #fff
			box-sizing: border-box
			padding: 0 8px
			.shop-desctitle
				width: 100%
				border-bottom: 1px solid #e9e9e9
				padding: 11px 0
				color: #333
			.shop-desccontent
				padding: 6px 0
				color: #666
				p
					line-height: 24px
				img
					text-align: center
					padding: 15px 0px
					display: block
					max-width: 100%
.slide-enter-active, .slide-leave-active
	transition: all 0.3s
.slide-enter, .slide-leave-to
	transform: translate3d(100%, 0, 0)
</style>