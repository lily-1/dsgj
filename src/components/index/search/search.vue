<template>
	<transition name="slide">
		<div class="search">
			<div class="search-input">
				<input class="searchInput" type="text" placeholder="请输入商品名称" id="searchInput" v-model="goodsName" />
				<div class="btnSearch" @click="search"></div>
				<span @click="cancel">取消</span>
			</div>
			<keep-alive>
				<router-view></router-view>
			</keep-alive>
		</div>
	</transition>
</template>

<script type="text/ecmascript-6">
	import SearchGoods from '@/components/index/search/search-goods/search-goods';

	export default{
		data() {
			return {
				goodsName: ''
			};
		},
		methods: {
			// 跳转到商品搜索列表页面
			search() {
				this.$router.push({
					path: '/searchDetail',
					query: {
						goodsName: this.goodsName
					}
				});
			},
			// 取消返回上一级页面
			cancel() {
				this.$router.back();
			}
		},
		components: {
			SearchGoods
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.search
	width: 100%
	position: fixed
	top: 0
	bottom: 0
	left: 0
	background: white
	z-index: 4
	.search-input
		position: absolute
		z-index: 1
		box-sizing: border-box
		border-bottom: 1px solid #D9D9D9
		padding: 0 8px 8px
		display: flex
		top: 16px
		left: 0
		right: 0
		.searchInput
			line-height: 36px
			height: 36px
			border-radius: 5px 0px 0px 5px
			background: #EFEFEF
			flex: 1
			font-family: "微软雅黑"
			font-size: 14px
			outline: none
			padding-left: 12px
		.btnSearch
			display: block
			width: 30px
			height: 36px
			background: #EFEFEF url(../img/icon_search@2x.png) no-repeat center
			background-size: 21px 20px
			border-radius: 0px 5px 5px 0px
			padding-left: 8px
			flex: 0 0 30px
		span
			width: 50px
			height: 36px
			line-height: 36px
			text-align: center
			font-size: 14px
.slide-enter-active, .slide-leave-active
	transition: all 0.3s
.slide-enter, .slide-leave-to
	transform: translate3d(100%, 0, 0)
</style>