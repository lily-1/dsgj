<template>
	<transition name="slide">
		<div class="combo-detail">
			<x-header :left-options="{backText: ''}">套餐详情</x-header>
			<scroll ref="detail" class="combo-content-box" :data="result">
				<div class="combo-content">
					<div class="combo-banner">
						<img class="banner" v-lazy="bannerpath" />
					</div>
					<div class="combo-name">
						{{ comboName }}
					</div>
					<div class="combo-price">
						<p class="price">
							<span class="retail-price">￥{{ retailprice }}</span>
							<span class="total-price">￥{{ totalprice }}</span>
						</p>
						<div class="cartcontrol-wrapper">
							<div class="cartcontrol">
								<span class="reduce" @click="reduceNum"></span>
								<span class="combonum">{{ productNum }}</span>
								<span class="add" @click="addNum"></span>
							</div>
						</div>
					</div>
					<div class="combo-comment">
						<div class="title">
							<span class="icon-title"></span>
							<p class="text-title">套餐评价</p>
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
					<div class="combodetail-item">
						<div class="title">
							<span class="icon-title"></span>
							<p class="text-title">套餐明细</p>
						</div>
						<div class="combo-desc-item" v-for="(item,index) in comboItem" :key="index">
							<p v-if="item.type=='text'" class="text">{{ item.value }}</p>
							<img v-else v-lazy="item.value" class="image" @load="successload" />
						</div>
					</div>
				</div>
			</scroll>
			<div class="combo-bought">
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
			<router-view></router-view>
		</div>
	</transition>
</template>

<script type="text/ecmascript-6">
	import Scroll from '@/components/base/scroll/scroll';
	import GoodComment from '@/components/base/good-comment/good-comment';
	import { getComboInfo, getGoodComment } from '@/api/product';
	import { wechatMixin, productMixin } from '@/common/js/mixin';
	import { XHeader } from 'vux';
	import { PICURL } from '@/common/js/config';

	export default {
		mixins: [wechatMixin, productMixin],
		methods: {
			async initData() {
				let id = this.$route.params.id;
				let comboResult = await getComboInfo(id);
				let shareParams = {
					title: comboResult.goodsName, // 分享标题
					desc: '售价:' + comboResult.minPrice, // 分享描述
					imgUrl: this.picurl + comboResult.picList[0] // 分享图标
				};
				this.wechatToShare(shareParams);
				this.comboData(comboResult);
				// 套餐评论
				let commentResult = await getGoodComment(id);
				this.commentList = commentResult.content;
				this.result = this.comboItem.concat(this.commentList);
			},
			comboData(data) {
				// 主图路径
				this.bannerpath = this.picurl + data.coverPicPath;
				// 设置价格
				this.retailprice = data.skus.retailPrice;
				this.totalprice = data.skus.originalPrice;
				// 套餐名称
				this.comboName = data.goodsName;
				this.skus = data.skus;
				// 套餐明细
				if (data.details) {
					this.comboItem = JSON.parse(data.details);
				}
			},
			orderconfirm() {
				let id = this.$route.params.id;
				let orderInfo = {
					skuId: this.skus.id,
					skuContent: this.skus.label,
					sellPrice: this.skus.retailPrice,
					productNum: this.productNum,
					goodsName: this.comboName,
					goodsPic: this.bannerpath
				};
				this.setOrderInfo(orderInfo);
				this.$router.push({
					path: `${id}/orderConfirm`
				});
			}
		},
		data () {
			return {
				result: [], // scroll滚动结果集
				comboItem: [], // 套餐明细
				commentList: [], // 评论数组
				productNum: 1, // 套餐数量
				retailprice: null, // 商品价格
				totalprice: null, // 促销价格
				bannerpath: '',
				comboName: '',
				skuId: '',
				deviceWidth: document.body.clientWidth - 16,
				balls: [], // 小球集合
				dropBalls: [], // 飞入的小球集合
				picurl: PICURL
			};
		},
		components: {
			Scroll,
			XHeader,
			GoodComment
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.combo-detail
	width: 100%
	position: fixed
	top: 0
	bottom: 0
	left: 0
	background: #fff
	z-index: 100
	.combo-content-box
		width: 100%
		position: absolute
		top: 47px
		left: 0
		bottom: 60px
		background: #f0f1f2
		.combo-content
			width: 100%
			height: auto
			overflow: hidden
			.combo-banner
				width: 100%
				height: 0
				padding-top: 100%
				position: relative
				.banner
					position: absolute
					top: 0
					bottom: 0
					width: 100%
					height: 100%
					display: inline-block
			.combo-name
				width: 100%
				line-height: 24px
				box-sizing: border-box
				padding: 12px 8px 6px
				font-weight: 600
				font-size: 16px
				color: #333
				background: #fff
				border-bottom: 1px solid #f2f2f2
			.combo-price
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
					.retail-price
						color: #FE3F51
						font-size: 16px
						font-weight: 600
					.total-price
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
						.combonum
							flex: 1
							font-size: 14px
							line-height: 28px
			.combo-comment
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
			.combodetail-item
				width: 100%
				height: auto
				overflow: hidden
				box-sizing: border-box
				background: #fff
				margin-bottom: 12px
				.combo-desc-item
					width: 100%
					box-sizing: border-box
					padding: 12px 8px
					font-size: 12px
					line-height: 20px
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
	.combo-bought
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