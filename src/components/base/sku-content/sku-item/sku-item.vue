<template>
	<div class="sku-item">
		<div class="sku-sortname">{{ skuinfo.name }}</div>
		<div class="sku-sortitem">
			<span class="item" v-for="(item, index) in skuinfo.attrValues" :key="index" :class="{'active': index === currentIndex}" @click="selectsku(index)">
				{{ item }}
			</span>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
	export default {
		props: {
			skuinfo: {
				type: Object,
				default: null
			},
			skuindex: {
				type: Number,
				default: null
			}
		},
		data () {
			return {
				currentIndex: 0
			};
		},
		methods: {
			selectsku(index) {
				this.currentIndex = index;
				this.$emit('selectsku', this.skuindex, index + 1);
			}
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.sku-item
	width: 100%
	height: auto
	overflow: hidden
	box-sizing: border-box
	padding-left: 12px
	.sku-sortname
		line-height: 24px
		margin-bottom: 6px
	.sku-sortitem
		width: 100%
		height: auto
		overflow: hidden
		.item
			line-height: 22px
			text-align: center
			box-sizing: border-box
			border: 1px solid #d9d9d9
			border-radius: 4px
			padding: 0 14px
			display: inline-block
			margin: 0 10px 10px 0
		.active
			border-color: #fe3f51
			color: #fff
			background: #fe3f51
</style>