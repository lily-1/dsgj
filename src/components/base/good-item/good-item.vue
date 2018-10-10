<template>
	<div class="good-item" @click="clickGood">
		<img class="good-avatar" v-lazy="goods.coverPicPath" :key="goods.id" />
		<div class="good-info">
			<div class="good-name" :class="{'lineclampthree': !hidebtn}">
				<p>{{ goods.name }}</p>
			</div>
			<div class="good-price">
				<div class="good-sell">
					<span class="goodsPrice">&yen;{{ goods.minPrice }}</span>
					<!-- <span class="sellingPrice" v-if="goods.activityPrice">&yen;{{ goods.sellingPrice }}</span> -->
				</div>
				<div class="btn-buy" v-if="hidebtn">购买</div>
			</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
	export default {
		props: {
			goods: {
				type: Object,
				default: null
			},
			hidebtn: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				currentSrc: ''
			};
		},
		methods: {
			clickGood() {
				this.$emit('toDetail', this.goods.id);
			}
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.good-item
	width: 100%
	padding: 10px 6px
	box-sizing: border-box
	display: flex
	border-bottom: 1px solid #f2f2f2
	.good-avatar
		flex: 0 0 96px
		width: 96px
		height: 96px
		box-sizing: border-box
		border: 1px solid #D9D9D9
		margin-right: 18px
		overflow: hidden
	.good-info
		flex: 1
		padding-top: 3px
		box-sizing: border-box
		.good-name
			width: 100%
			height: 68px
			box-sizing: border-box
			padding-bottom: 28px
			p
				font-size: 14px
				font-weight: 600
				line-height: 20px
				max-height: 40px
				display: -webkit-box
				text-overflow: ellipsis
				-webkit-line-clamp: 2
				-webkit-box-orient: vertical
				overflow: hidden
				color: #333
		.lineclampthree
			padding-bottom: 0
			p
				max-height: 60px
				-webkit-line-clamp: 3
		.good-price
			display: flex
			line-height: 20px
			height: 20px
			.good-sell
				flex: 1
				font-size: 14px
				color: #fe3f51
				.sellingPrice
					text-decoration: line-through
			.btn-buy
				flex: 0 0 56px
				background: #fe3f51
				color: #fff
				text-align: center
				border-radius: 10px
</style>