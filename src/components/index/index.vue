<template>
    <div class="index">
		<scroll class="index-content" ref="index" :data="result" :indexflag="true" :pullup="pullup" :pulldown="pulldown" @pulldown="refresh" @pullup="getMoreGood">
			<!--搜索输入框-->
			<div class="good_input"  @click="search()">
				<a href="javascript:void(0)"></a>
				<div id="searchInput" class="search_input">请输入商品名称</div>
			</div>
			<!--门店简介-->
			<div class="store-introduce-box">
				<div class="store-introduce">
					<div class="bg-storeinfo">
						<div class="bg-shadow"></div>
						<img v-if="storeInfo && storeInfo.shopfrontImageUrl" v-lazy="storeInfo.shopfrontImageUrl + '?x-oss-process=image/resize,m_fill,h_140,w_' + itemW" class="bg" />
					</div>
					<div class="content">
						<div class="store-name ellipsis" v-if="storeInfo">
							{{ storeInfo.name }}
						</div>
						<div class="store-contacter ellipsis" v-if="storeInfo">
							{{ storeInfo.contactName }}
						</div>
						<div class="store-address" v-if="storeInfo">
							<p class="ellipsis">{{ storeInfo.detailAddress }}</p>
						</div>
						<div class="callBtn" @click="callcontact"></div>
					</div>
				</div>
			</div>
			<!--服务选择-->
			<div class="catalogue">
				<ul>
					<!--在线预约-->
					<li>
						<div @click="toAppointment">
							<img src="./img/icon_appointment@2x.png" />
							<span>在线预约</span>
						</div>
					</li>
					<!--优惠券-->
					<li>
						<router-link :to="{path: '/storeCouponList'}">
							<img src="./img/icon_coupon@2x.png" />
							<span>优惠券</span>
						</router-link>
					</li>
					<!--门店导航-->
					<li @click="toMap">
						<img src="./img/icon_map@2x.png" />
						<span>门店导航</span>
					</li>
					<!--关于我们-->
					<li>
						<router-link :to="{path: '/about'}">
							<img src="./img/icon_about@2x.png" />
							<span>关于我们</span>
						</router-link>
					</li>
				</ul>
			</div>
			<!-- 活动宣传 -->
			<div class="store-active" v-if="false">
				<swiper class="bannerswiper" v-if="storeInfo.activityVos && storeInfo.activityVos.length > 0" :height="'158px'" :interval="3000" :dots-position="'right'" loop auto>
					<swiper-item v-for="(item, index) in storeInfo.activityVos" :key="index" @click.native="activeClick(item)">
						<img :src="item.path" />
					</swiper-item>
				</swiper>
			</div>
			<!--套餐模块入口-->
			<div class="comboVip" v-if="comboList.length > 0">
				<div class="title">
					<div class="icon">
						<img src="./img/icon_combo@2x.png" alt="">
					</div>
					<router-link :to="{path: '/comboList'}" v-show="comboList.length > 1">
						<div class="more">
							查看更多
						</div>
					</router-link>
				</div>
				<router-link tag="div" class="combo-single" v-if="comboList.length <= 1" :to="{path: `/comboDetail/${comboList[0].id}`}">
					<div class="combo-avatar">
						<img class="avatar" v-lazy="comboList[0].coverPicPath" :key="comboList[0].id" />
					</div>
					<div class="combo-info">
						<p class="combo-name">{{ comboList[0].name }}</p>
						<div class="combo-price">
							<p class="combo-sellprice">￥{{ comboList[0].retailPrice }}</p>
							<p class="combo-discount">￥{{ comboList[0].originalPrice }}</p>
						</div>
					</div>
				</router-link>
				<div class="combo-multi" v-else-if="comboList.length >= 1">
					<div class="combo-multi-box" ref="scrollerplans">
						<div class="content" ref="planWrapper">
							<router-link tag="div" class="combo-multi-item" v-if="comboList.length > 1" v-for="(item, index) in comboList" :to="{path: `/comboDetail/${item.id}`}" :key="index">
								<div class="combo-avatar">
									<img class="avatar" v-lazy="item.coverPicPath" :key="item.id" />
								</div>
								<div class="combo-info">
									<p class="combo-name">{{ item.name }}</p>
									<div class="combo-price">
										<p class="combo-sellprice">￥{{ item.retailPrice }}</p>
										<p class="combo-discount">￥{{ item.originalPrice }}</p>
									</div>
								</div>
							</router-link>
						</div>
					</div>
				</div>
			</div>
			<!--商品列表-->
			<div class="goodslist"  v-if="goodList.length > 0">
				<div class="title">
					<div class="icon">
						<img src="./img/icon_good@2x.png" alt="">
					</div>
				</div>
				<goodItemIndex v-for="(goods, index) in goodList" :key="index" :goods="goods" :storeId="storeId"></goodItemIndex>
			</div>
		</scroll>
		<router-view></router-view>
		<actionsheet v-model="showArr.showmenu" :menus="menus" show-cancel></actionsheet>
	</div>
</template>

<script type="text/ecmascript-6">
	import { Actionsheet, Swiper, SwiperItem } from 'vux';
	import { getStoreInfo, getGoodList, getComboList } from '@/api/index';
	import { wechatMixin, customerMixin } from '@/common/js/mixin';
	import Scroll from '@/components/base/scroll/scroll';
	import GoodItemIndex from '@/components/base/good-item/good-item-index';
    import BScroll from 'better-scroll';

    const pageSize = 8;

    export default {
        mixins: [wechatMixin, customerMixin],
        methods: {
			async toAppointment() {
				let validate = await this.isCustomer();
				if (validate) {
					this.$router.push({
						path: '/subscribe'
					});
				} else {
					this.$vux.alert.show({
						content: '非门店客户，该功能不可用'
					});
				}
			},
            async _initData() {
				if (!this.storeId && !this.publicId) {
					return;
				}
				// 门店信息接口
				let storeResult = await getStoreInfo(this.storeId);
				// 设置分享
				let shareParams = {
					title: '首页', // 分享标题
					desc: '爱车的小伙伴们，微信平台上线啦', // 分享描述
					imgUrl: 'http://f.c.tticar.com/logo_wechat.png' // 分享图标
				};
				this.wechatToShare(shareParams);
				// 设置门店信息
				this.storeInfo = storeResult;
				// 电话号码数组更新
				this.menus.length = 0;
				// 放置联系门店手机号
				let phoneObj = {};
				phoneObj.label = '<a href="tel:' + this.storeInfo.businessTelephone + '" style="width:100%;height:100%;display:inline-block"><span style="color:#1aabff;font-size:18px;">' + this.storeInfo.businessTelephone + '</span></a>';
				this.menus.push(phoneObj);
				// 获取门店推荐套餐数据
				let comboListResult = await getComboList(this.storeId, 0, 3);
				this.comboList = comboListResult.content;
				this.$nextTick(() => {
					if (!this.$refs.planWrapper) {
						return;
					}
					let planWidth = this.comboList.length * 173;
					this.$refs.planWrapper.style.width = planWidth + 'px';
					this._initComboScroll();
				});
				// 商品列表接口
				let goodResult = await getGoodList(this.storeId, this.pageNum, pageSize);
				this.goodList = goodResult.content;
				this.checkMore(goodResult);
			},
            // 上拉加载更多商品
			getMoreGood() {
				// 是否有下一页标记
				if (!this.loadMore) {
					this.$refs.index.forceUpdate(true);
					return;
				}
				this.pageNum++;
				setTimeout(async () => {
					let goodListResult = await getGoodList(this.storeId, this.pageNum, pageSize);
					this.goodList = this.goodList.concat(goodListResult.content);
					this.checkMore(goodListResult);
				}, 1000);
			},
			// 刷新页面
			refresh() {
				this.pageNum = 0;
				setTimeout(() => {
					this._initData();
				}, 1000);
			},
			// 加载商品数据后,判断是否含有下一页
			checkMore(data) {
				this.loadMore = !data.isLast;
				this.$refs.index.forceUpdate(data.isLast);
			},
			// 搜索跳转搜索页面
			search() {
				this.$router.push({
					path: '/search'
				});
			},
			// 活动点击分类
			activeClick(item) {
				if (item.type === 'NORMAL') {
					// 活动宣传
					this.$router.push({
						path: `/activeInfo/${item.id}`
					});
				} else if (item.type === 'MALL_GOODS') {
					// 商品活动
					this.$router.push({
						path: `/goodDetail/${item.mallGoodsId}`
					});
				} else {
					// 促销活动
					this.$router.push({
						path: `/activeDetail/${item.id}`
					});
				}
			},
			// 初始化套餐精选横向滚动
			_initComboScroll() {
				this.comboScroll = new BScroll(this.$refs.scrollerplans, {
					scrollX: true,
					scrollY: false,
					momentum: false
				});
            },
            callcontact() {
				this.showArr.showmenu = true;
			}
        },
        created () {
			this.$nextTick(() => {
				let itemW = document.getElementsByClassName('store-introduce')[0].offsetWidth;
				this.itemW = parseInt(itemW);
			});
			if (!this.storeId) {
				return;
			}
			this._initData();
		},
		activated() {
			if (this.$refs.index) {
				this.$refs.index.refresh();
			} else if (this.$refs.scrollerplans) {
				this.$refs.scrollerplans.refresh();
			}
		},
		computed: {
			result() {
				if (!this.comboList) {
					return this.goodList;
				}
				return this.goodList.concat(this.comboList);
			}
        },
        data() {
            return {
				itemW: 0,
                menus: [],
				storeInfo: {}, // 门店数据集合
				goodList: [], // 商品列表
				comboList: [], // 套餐列表
				dotsposition: 'center', // 轮播点位置
				pageNum: 0,
				showArr: {
					showmenu: false
				},
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
            Actionsheet,
			Swiper,
			SwiperItem,
			Scroll,
			GoodItemIndex
        }
    };
</script>

<style scoped lang="stylus">
.index
	width: 100%
	position: absolute
	top: 0
	bottom: 53px
	left: 0
	background: #fff
	.index-content
		width: 100%
		overflow: hidden
		position: absolute
		top: 0
		left: 0
		bottom: 0
		/*=====头部搜索框=====*/
		.good_input
			z-index: 1
			border-radius: 5px
			display: flex
			width: 100%
			box-sizing: border-box
			padding: 8px
			.search_input
				line-height: 36px
				height: 36px
				border-radius: 0px 6px 6px 0px
				background: #F1F1F5
				flex: 1
				font-family: "微软雅黑"
				font-size: 14px
				outline: none
				padding-left: 6px
				color: #333
			a
				display: block
				width: 30px
				height: 36px
				background: #F1F1F5 url(./img/icon_search@2x.png) no-repeat center
				background-size: 21px 20px
				border-radius: 6px 0px 0px 6px
				padding-left: 8px
				flex: 0 0 30px
		/*=====头部广告=====*/
		.store-introduce-box
			margin: 0 8px
			color: white
			overflow: hidden
			height: auto
			border-radius: 6px
			.store-introduce
				width: 100%
				height: 140px
				overflow: hidden
				position: relative
				.bg-storeinfo
					width: 100%
					height: 100%
					position: absolute
					top: 0
					.bg-shadow
						position: absolute
						top: 0
						bottom: 0
						width: 100%
						height: 100%
						background: rgba(0, 0, 0, 0.3)
						z-index: 1
						border-radius: 8px
					.bg
						height: 100%
						width: 100%
						display: inline-block
						border-radius: 8px
				.content
					width: 100%
					height: 100%
					position: absolute
					top: 0
					z-index: 2
					box-sizing: border-box
					padding: 12px 28px 18px 16px
					.store-name, .store-contacter
						box-sizing: border-box
						padding-right: 28px
					.store-name
						font-size: 22px
						line-height: 28px
						font-weight: 600
						margin-bottom: 6px
					.store-contacter
						font-size: 14px
						line-height: 18px
					.store-address
						width: 100%
						box-sizing: border-box
						padding: 0 16px
						height: 30px
						line-height: 30px
						position: absolute
						bottom: 16px
						left: 0
						p
							border-radius: 100px
							font-size: 14px
							background: #FF5151 url('./img/icon_address@2x.png') no-repeat left 10px center
							background-size: 14px 16px
							box-sizing: border-box
							padding-left: 32px
					.callBtn
						width: 28px
						height: 28px
						background: url('./img/icon_call@2x.png') no-repeat center center
						background-size: 28px 28px
						position: absolute
						top: 18px
						right: 28px
					.ellipsis
						white-space: nowrap
						overflow: hidden
						text-overflow: ellipsis
		/*=====活动模块=====*/
		.store-active
			margin: 0 16px
			overflow: hidden
			padding-bottom: 12px
			.bannerswiper
				width: 100%
				height: 158px
				img
					width: 100%
					border-radius: 6px
					overflow: hidden
					height: 100%
		/*=====服务选项=====*/
		.catalogue
			margin: 0 8px
			padding: 16px 0
			ul
				width: 100%
				display: flex
				box-sizing: border-box
				li
					flex: 1
					display: block
					box-sizing: border-box
					color: #7e8c8d
					img,span
						width: 48px
						display: block
						margin: 0 auto
						text-align: center
						font-size: 12px
					span
						margin-top: 10px
						width: 100%
						color: #313131
		/*==========套餐以及商品列表模块==========*/
		.comboVip, .goodslist
			width: 100%
			height: auto
			overflow: hidden
			.title
				width: 100%
				height: 48px
				display: flex
				align-items: center
				box-sizing: border-box
				padding: 0 14px
				background: #fff
				.icon, .more
					flex: 1
					height: 24px
					line-height: 24px
					box-sizing: border-box
				.icon
					img
						width: 74px
						height: 20px
						margin: 2px 0
				.more
					text-align: right
					padding-right: 14px
					background: url(./img/icon_right@2x.png) no-repeat right center
					background-size: 8px 12px
					color: #9B9B9B
		/*==========套餐专区==========*/
		.comboVip
			width: 100%
			height: auto
			overflow: hidden
			border-top: 6px solid #f8f8f8
			border-bottom: 6px solid #f8f8f8
			.combo-single
				width: 100%
				height: 128px
				box-sizing: border-box
				padding-left: 20px
				display: flex
				padding-bottom: 16px
				.combo-avatar
					flex: 0 0 156px
					width: 156px
					.avatar
						width: 100%
						height: 100%
						border-radius: 6px
				.combo-info
					flex: 1
					box-sizing: border-box
					padding-left: 12px
					.combo-name
						width: 100%
						height: 40px
						margin-bottom: 44px
						line-height: 20px
						overflow : hidden
						text-overflow: ellipsis
						display: -webkit-box
						-webkit-line-clamp: 2
						-webkit-box-orient: vertical
					.combo-price
						width: 100%
						height: 24px
						display: flex
						align-items: flex-end
						.combo-sellprice
							font-size: 16px
							color: #FF3B3B
						.combo-discount
							font-size: 12px
							color: #979797
							text-decoration: line-through
							padding-left: 8px
			.combo-multi
				width: 100%
				height: 180px
				overflow: hidden
				box-sizing: border-box
				padding-left: 14px
				.combo-multi-box
					width: 100%
					height: 100%
					overflow: hidden
					.content
						height: 100%
						.combo-multi-item
							width: 165px
							height: 100%
							float: left
							margin-right: 8px
							.combo-avatar
								width: 100%
								height: 110px
								border-radius: 6px
								overflow: hidden
								.avatar
									width: 100%
									height: 100%
							.combo-info
								width: 100%
								height: 50px
								padding: 6px 0
								.combo-name
									width: 100%
									height: 36px
									line-height: 18px
									overflow : hidden
									text-overflow: ellipsis
									display: -webkit-box
									-webkit-line-clamp: 2
									-webkit-box-orient: vertical
									font-size: 14px
								.combo-price
									width: 100%
									height: 22px
									display: flex
									line-height: 22px
									.combo-sellprice
										font-size: 16px
										color: #FF3B3B
									.combo-discount
										font-size: 12px
										color: #979797
										text-decoration: line-through
										padding-left: 8px
										line-height: 26px
		.goodslist
			height: auto
			overflow: hidden
			background: #F8F8F8
			box-sizing: border-box
			padding: 4px
</style>
