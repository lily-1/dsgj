<template>
	<div class="loading">
		<span class="ani"><spinner type="crescent"></spinner></span>
	</div>
</template>

<script type="text/ecmascript-6">
	import { Spinner } from 'vux';

	export default {
		components: {
			Spinner
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.loading
	width: 100%
	text-align: center
	.ani
		height: 28px
		display: inline-block
		.pull-txt
			height:30px
			line-height: 30px
			display: inline-block
		.vux-spinner
			vertical-align: top
			background: url(./icon_carhover@2x.png) no-repeat center
			background-size: 15px 15px
			stroke: #ff0000 !important
			circle
				stroke-width: 2px !important
</style>