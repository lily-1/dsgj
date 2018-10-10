<template>
	<div class="combo-item" @click="clickCombo">
		<div class="combo-banner">
			<img class="combo-avatar" v-lazy="combo.coverPicPath" />
		</div>
		<div class="combo-info">
			<div class="combo-name">{{ combo.name }}</div>
			<div class="combo-price">￥{{ combo.retailPrice }}</div>
			<div class="combo-total">{{ combo.originalPrice ? '￥'+combo.originalPrice : '' }}</div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
	export default {
		props: {
			combo: {
				type: Object,
				default: null
			}
		},
		methods: {
			clickCombo() {
				this.$emit('toDetail', this.combo.id);
			}
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.combo-item
	width: 100%
	height: auto
	overflow: hidden
	background: #fff
	padding-top: 18px
	.combo-banner
		width: 100%
		position: relative
		height: 0
		padding-top: 46%
		overflow: hidden
		.combo-avatar
			position: absolute
			top: 0
			bottom: 0
			width: 100%
			height: 100%
			display: inline-block
	.combo-info
		width: 100%
		height: 28px
		line-height: 28px
		box-sizing: border-box
		padding-left: 9px
		display: flex
		color: #999
		font-size: 14px
		.combo-name
			flex: 0 0 220px
			width: 220px
			text-overflow: ellipsis
			overflow: hidden
			white-space: nowrap
			color: #333
			font-size: 14px
			font-weight: 600
			@media screen and (max-width: 374px)
				flex: 0 0 180px
				width: 180px
		.combo-price
			flex: 1
			text-align: center
			color: #fe3f51
		.combo-total
			flex: 1
			text-align: center
			text-decoration: line-through
			color: #666
</style>