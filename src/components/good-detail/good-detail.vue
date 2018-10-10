 <template>
	<transition name="slide">
		<div class="good-detail">
			<scroll ref="detail" class="good-content-box" :data="result">
				<div>
					<x-header :left-options="{backText: ''}">商品详情</x-header>
					<div class="goods-content">
						<div class="banner">
							<swiper class="banner-swiper"
								:aspect-ratio="0.8"
								:interval="1000"
								:dots-position="dotsposition"
								:dots-class="dotsclass"
								:auto="false"
								loop>
								<swiper-item v-for="(item, index) in pictures" :key="index">
									<img :src="picurl + item" />
								</swiper-item>
							</swiper>
						</div>
						<div class="goods-name">
							{{ goodsInfo.goodsName }}
						</div>
						<!-- <div class="active-time" v-if="activetime">
							<p class="time">活动时间: {{ activetime }}</p>
						</div> -->
						<div class="goods-price">
							<p class="price">
								<span class="sell-price">￥{{ sellPrice }}</span>
							</p>
							<!-- <p class="price" v-else>
								<span class="sell-price">￥{{ activeprice }}</span>
								<span class="discount-price">￥{{ sellprice }}</span>
							</p> -->
							<div class="cartcontrol-wrapper">
								<div class="cartcontrol">
									<span class="reduce" @click="reduceNum"></span>
									<span class="goodnum">{{productNum}}</span>
									<span class="add" @click="addNum"></span>
								</div>
							</div>
						</div>
						<div class="goods-sell-info">
							<p class="send-type">配送:{{ goodsTote | filterTote }}</p>
							<p class="install-type">需要安装:{{ install | filterInstall }}</p>
						</div>
						<div class="goods-sort" @click="showsku">
							<p class="sku-title">选择规格:</p>
							<span class="sku-content" v-show="skuContent !== ''">
								<i class="icon"></i>
								<i class="text">{{ skuContent }}</i>
							</span>
						</div>
						<div class="goods-comment">
							<div class="title">
								<span class="icon-title"></span>
								<p class="text-title">商品评价</p>
							</div>
							<div class="goods-commentlist" v-if="commentList.length > 0">
								<goodComment v-for="(item, index) in commentList" :comment="item" :key="index" :noborder="true"></goodComment>
								<div class="more-comment" @click="loadMoreComment">
									查看更多
								</div>
							</div>
							<p v-else class="no-comment">
								暂无评论
							</p>
						</div>
						<div class="goods-desc">
							<div class="title">
								<span class="icon-title"></span>
								<p class="text-title">商品详情</p>
							</div>
							<div class="goods-desc-item" v-for="(item,index) in goodsDesc" :key="index">
								<p v-if="item.type=='text'" class="text">{{ item.value }}</p>
								<img v-else v-lazy="item.value" class="image" @load="successload" />
							</div>
						</div>
					</div>
				</div>
			</scroll>
			<div class="good-bought">
				<p class="btnbox">
					<span class="addnum" v-show="productNum>=2">{{ productNum }}</span>
					<span class="btn" @click="orderconfirm">立刻购买</span>
				</p>
			</div>
			<div class="ball-container">
				<div v-for="(ball, index) in balls" :key="index">
					<transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
						<div class="ball" v-show="ball.show">
							<div class="inner inner-hook"></div>
						</div>
					</transition>
				</div>
			</div>
			<skuContent ref="skucontent" :sku="sku" :name="goodsInfo.goodsName" :url="picurl + pictures[0]" @updatesku="updatesku"></skuContent>
			<router-view></router-view>
		</div>
	</transition>
</template>

<script type="text/babel">
	import { XHeader, Swiper, SwiperItem } from 'vux';
	// 获取微信配置函数,设置微信分享函数
	import { PICURL } from '@/common/js/config';
	import { wechatMixin, productMixin } from '@/common/js/mixin';
	import { jsonValidate } from '@/common/js/util';
	import { getGoodInfo, getGoodComment } from '@/api/product';
	import Scroll from '@/components/base/scroll/scroll';
	import GoodComment from '@/components/base/good-comment/good-comment';
	import SkuContent from '@/components/base/sku-content/sku-content';

	export default {
		mixins: [wechatMixin, productMixin],
		methods: {
			async initData() {
				let id = this.$route.params.id;
				let goodResult = await getGoodInfo(id);
				let shareParams = {
					title: goodResult.goodsName, // 分享标题
					desc: '售价:' + goodResult.minPrice, // 分享描述
					imgUrl: this.picurl + goodResult.picList[0] // 分享图标
				};
				this.wechatToShare(shareParams);
				// 初始化页面数据
				this.goodData(goodResult);
				let commentResult = await getGoodComment(id);
				this.commentList = commentResult.content;
				this.result = this.goodsDesc.concat(this.commentList);
			},
			goodData(data) {
				// console.log(data);
				if (data.startDateTime && data.endDateTime) {
					this.activetime = data.startDateTime + ' ~ ' + data.endDateTime;
				}
				// 图文详情
				if (data.details && jsonValidate(data.details)) {
					this.goodsDesc = JSON.parse(data.details);
				}
				this.goodsDesc.forEach((item) => {
					if (item.type === 'image' && item.value.indexOf('aliyuncs') > 0) {
						item.value = item.value + '?x-oss-process=image/resize,m_lfit,w_' + this.deviceWidth;
					}
				});
				// 设置配送以及安装方式
				this.goodsTote = data.deliveryType;
				this.install = data.install;
				// 设置价格
				this.sellPrice = data.minPrice;
				// 商品信息
				this.goodsInfo = data;
				// 该商品所有规格属性数组
				this.sku = data.salesAttributes;
				this.skus = data.skus;
				// 存放sku字符串1:1:1
				let skustr = '';
				this.sku.forEach((item, index) => {
					skustr = skustr + (index === 0 ? '1' : ':1');
				});
				this.skus.forEach((item) => {
					if (item.key === skustr) {
						this.skuId = item.id;
						this.skuContent = item.label;
						this.sellPrice = item.retailPrice;
						return false;
					}
				});
				this.pictures = data.picList;
				// console.log(this.pictures);
			},
			updatesku(skustr) {
				this.skus.forEach((item) => {
					if (item.key === skustr) {
						this.skuId = item.id;
						this.skuContent = item.label;
						this.sellPrice = item.retailPrice;
						return false;
					}
				});
			},
			orderconfirm() {
				let id = this.$route.params.id;
				let orderInfo = {
					skuId: this.skuId,
					skuContent: this.skuContent,
					sellPrice: this.sellPrice,
					productNum: this.productNum,
					goodsName: this.goodsInfo.goodsName,
					goodsPic: PICURL + this.goodsInfo.coverPicPath
				};
				this.setOrderInfo(orderInfo);
				this.$router.push({
					path: `${id}/orderConfirm`
				});
			},
			showsku() {
				this.$refs.skucontent.show();
			}
		},
		filters: {
			filterTote(data) {
				if (data === '1') {
					return '门店自提';
				}
				return '';
			},
			filterInstall(data) {
				if (data) {
					return '是';
				} else {
					return '否';
				}
			}
		},
		data () {
			return {
				result: [], // 重置scroll组件结果集
				commentList: [], // 评论列表
				goodsDesc: [], // 图文详情描述
				skuId: '',
				skuContent: '', // 当前sku规格属性展示'默认:标配'
				goodsTote: '', // 配送方式
				install: false, // 安装方式
				productNum: 1,
				sellPrice: null, // 商品价格
				goodsInfo: {}, // 商品信息
				sku: [], // 该商品所有规格属性数组
				skus: [], // 该商品所有规格组合1:1,1:2
				pictures: [], // 图片数组
				dotsposition: 'center', // 轮播点位置
				dotsclass: 'swiperdotsclass', // 轮播点类名
				balls: [], // 点击加号小球飞入
				dropBalls: [],
				deviceWidth: document.body.clientWidth - 16,
				picurl: PICURL
			};
		},
		components: {
			Scroll,
			XHeader,
			Swiper,
			SwiperItem,
			GoodComment,
			SkuContent
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.good-detail
	width: 100%
	position: fixed
	top: 0
	left: 0
	bottom: 0
	background: #fff
	z-index: 99
	.good-content-box
		width: 100%
		position: absolute
		top: 0
		left: 0
		bottom: 60px
		background: #f0f1f2
		.goods-content
			width: 100%
			height: auto
			overflow: hidden
			.banner
				img
					width: 100%
					height: 100%
					display: block
			.goods-name
				width: 100%
				line-height: 24px
				box-sizing: border-box
				padding: 12px 8px 6px
				font-weight: 600
				font-size: 16px
				color: #333
				background: #fff
			.active-time
				width: 100%
				height: 28px
				line-height: 28px
				margin-bottom: 6px
				background: #fff
				.time
					box-sizing: border-box
					padding-left: 24px
					background: url(./img/icon_clock.png) no-repeat left 6px center
					background-size: 12px 12px
			.goods-price
				width: 100%
				display: flex
				position: relative
				box-sizing: border-box
				padding: 4px 8px
				background: #fff
				.price
					flex: 2
					font-size: 14px
					line-height: 24px
					.sell-price
						color: #FE3F51
						font-size: 16px
						font-weight: 600
					.discount-price
						color: #d9d9d9
						text-decoration: line-through
				.cartcontrol-wrapper
					flex: 1
					color: #999999
					.cartcontrol
						width: 100%
						display: flex
						span
							flex: 0 0 25px
							width: 25px
							height: 25px
							line-height: 25px
							text-align: center
							box-sizing: border-box
							border-radius: 50%
							font-size: 18px
							display: inline-block
							&.add
								border: 1px solid #fe3f51
								color: #fe3f51
								background: url(./img/icon_add.png) no-repeat center
								background-size: 50% 50%
							&.reduce
								background: url(./img/icon_reduce.png) no-repeat center
								background-size: 50% auto
								border: 1px solid #d9d9d9
						.goodnum
							flex: 1
							font-size: 14px
							line-height: 28px
			.goods-sell-info
				width: 100%
				box-sizing: border-box
				display: flex
				margin-top: 14px
				padding: 14px 8px 0
				background: #fff
				p
					flex: 1
					color: #999
					font-size: 14px
			.goods-sort
				padding: 16px 8px
				font-size: 0
				background: #fff url(./img/icon_right.png) no-repeat right center
				background-size: 7px 12px
				box-sizing: border-box
				display: flex
				.sku-title, .sku-content
					display: inline-block
					vertical-align: top
					font-size: 14px
				.sku-title
					flex: 0 0 60px
					width: 60px
					color: #9C9C9C
					line-height: 20px
					margin-right: 12px
				.sku-content
					flex: 1
					height: 20px
					line-height: 18px
					padding: 0 12px
					color: #FE3F51
					position: relative
					overflow: hidden
					background: #fff
					.icon
						position: absolute
						width: 12px
						height: 20px
						top: 0
						left: 0
						background: url(img/bg_standard@2x.png) no-repeat
						background-size: 12px 20px
					.text
						width: auto
						max-width: 100%
						height: 20px
						border: 1px solid #FE5262
						border-left: 0
						box-sizing: border-box
						text-overflow: ellipsis
						overflow: hidden
						white-space: nowrap
						display: inline-block
						font-style: normal
						padding-right: 10px
			.goods-comment
				width: 100%
				height: auto
				overflow: hidden
				background: #fff
				margin: 10px 0 16px
				.no-comment
					width: 100%
					height: 20px
					padding: 10px
				.more-comment
					width: 60px
					line-height: 20px
					padding: 0 10px
					font-size: 12px
					margin: 12px auto
					border: 1px solid #fe3f51
					border-radius: 8px
					text-align: center
					color: #fe3f51
			.goods-desc
				background: #fff
				.goods-desc-item
					width: 100%
					box-sizing: border-box
					padding: 0 8px
					font-size: 12px
					line-height: 20px
					margin: 12px 0
					img
						width: 100%
	.title
		width: 100%
		box-sizing: border-box
		line-height: 22px
		font-size: 14px
		font-weight: 600
		color: #333
		padding: 10px 16px
		position: relative
		.icon-title
			width: 3px
			height: 16px
			background: #fe3f51
			border-radius: 3px
			position: absolute
			display: block
			left: 6px
			top: 50%
			margin-top: -8px
	.good-bought
		width: 100%
		height: 60px
		background: #fff
		display: flex
		position: fixed
		bottom: 0
		box-sizing: border-box
		border-top: 1px solid #d9d9d9
		.addnum
			width: 18px
			height: 18px
			line-height: 18px
			text-align: center
			border: 1px solid #FE3F51
			border-radius: 18px
			font-size: 9px
			font-weight: 700
			color: #FE3F51
			background: white
			position: absolute
			top: 0
			left: 6px
		.btnbox
			flex: 1
			display: flex
			box-sizing: border-box
			padding: 8px 8px
			border-radius: 6px
			.btn
				flex: 1
				text-align: center
				line-height: 43px
				color: white
				font-size: 14px
				border-radius: 22px
				background: #FE3F51
	.ball-container
		.ball
			bottom: 39px
			position: fixed
			left: 6px
			transition: all 0.4s cubic-bezier(.49,-0.69,.79,.37)
			z-index: 200
			.inner
				width: 20px
				height: 20px
				border-radius: 50%
				background: #fe3f51
				transition: all 0.4s linear
.slide-enter-active, .slide-leave-active
	transition: all 0.3s
.slide-enter, .slide-leave-to
	transform: translate3d(100%, 0, 0)
</style>