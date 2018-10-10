<template>
	<div class="goodsitemIndex" @click="clickGood">
		<div class="bg-box">
			<img v-lazy="goods.coverPicPath + '?x-oss-process=image/resize,m_lfit,w_'+deviceWidth" :key="goods.id">
		</div>
		<div class="goodsInfo">
			<div class="shopSecRight">
				<p class="goodsname">{{ goods.name }}</p>
			</div>
			<div class="goodsBottom">
				<!-- <p class="goodssell" v-if="goods.activityPrice !== null">
					<span class="goodsPrice">&yen;{{ goods.activityPrice }}</span>
					<span class="sellingPrice">&yen;{{ goods.goodsInfo.sellingPrice }}</span>
				</p> -->
				<p class="goodssell">
					<span class="goodsPrice">&yen;{{ goods.minPrice }}</span>
				</p>
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
	export default{
		props: {
			goods: {
				type: Object
			},
			type: {
				type: Number
			}
		},
		methods: {
			clickGood() {
				this.$router.push({
					path: `/goodDetail/${this.goods.id}`
				});
			}
		},
		data () {
			return {
				deviceWidth: parseInt(document.body.clientWidth / 2 - 40)
			};
		}
	};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
.goodsitemIndex
	width: 50%
	height: auto
	overflow: hidden
	padding: 4px
	box-sizing: border-box
	display: inline-block
	.bg-box
		position: relative
		width: 100%
		height: 0
		padding-top: 100%
		overflow: hidden
		img
			position: absolute
			top: 0
			bottom: 0
			width: 100%
			height: 100%
			display: inline-block
	p
		width: 100%
		height: auto
		overflow: hidden
	.goodsname
		line-height: 20px
		height: 54px
		font-size: 16px
		padding: 14px 6px 0
		background: #fff
		box-sizing: border-box
		overflow: hidden
		text-overflow: ellipsis
		display: -webkit-box
		-webkit-line-clamp: 2
		-webkit-box-orient: vertical
		word-wrap: break-word
		word-break: break-all
	.goodssell
		background: #fff
		box-sizing: border-box
		padding: 14px 6px 12px
		.goodsPrice
			color: #fc3b52
			font-weight: bold
			font-size: 16px
		.sellingPrice
			color: #d9d9d9
			text-decoration: line-through
</style>
