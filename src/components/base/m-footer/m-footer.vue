<template>
	<div class="footer">
		<div class="footeritem">
			<router-link  :to="{path: '/index'}">
				<img class="activenone" src="./indexno@2x.png">
				<img class="activeshow" src="./index@2x.png">
				<span>首页</span>
			</router-link>
		</div>
		<div class="footeritem">
			<router-link  :to="{path: '/goodClassify'}">
				<img class="activenone" src="./shopcityno@2x.png">
				<img class="activeshow" src="./shopcity@2x.png">
				<span>分类</span>
			</router-link>
		</div>
		<div class="footeritem">
			<router-link :to="{path: '/userCenter'}">
				<img class="activenone" src="./mineno@2x.png">
				<img class="activeshow" src="./mine@2x.png">
				<span>我的</span>
			</router-link>
		</div>
	</div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<script type="text/ecmascript-6">
import { Tabbar, TabbarItem } from 'vux';

export default {
	components: {
		Tabbar,
		TabbarItem
	}
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.footer
	position: fixed;
	bottom: 0;
	width: 100%
	height: 53px
	box-sizing: border-box
	border-top: 1px solid #D9D9D9
	display: flex
	padding-top: 7px
	background: white
	z-index: 1
	.footeritem
		flex: 1
		text-align: center
		&:nth-child(1)
			img
				width: 22px
		&:nth-child(2)
			img
				width: 20px
		&:nth-child(3)
			img
				width: 20px
		img
			height: 17px
			display: block
			margin: 0 auto
			margin-bottom: 4px
		.activeshow
			display: none
		.active
			position: relative
			.activeshow
				display: block
			.activenone
				display: none
			span
				color: #f0b514
		span
			width: 100%
			height: 22px
			line-height: 22px
			display: inline-block
			font-size: 14px
			color: #000
</style>
