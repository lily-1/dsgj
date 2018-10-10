<template>
	<transition name="slide">
		<div class="search-goods">
			<x-header :left-options="{backText: ''}" class="title">商品列表</x-header>
			<!--===========搜索框==============-->
			<div class="search-input">
				<input class="searchInput" type="text" placeholder="请输入商品名称" id="searchInput" v-model="goodsName" />
				<div class="btnSearch"  @click="getSearchResult"></div>
			</div>
			<!--===========选项卡==============-->
			<ul class="tablist">
				<li v-for='(tabitem, index) in tabList' :class="{'active': sort === tabitem.sort}" @click="selectTab(tabitem, index)" :key="index">
					{{ tabitem.name }}
					<span class="icon_down" v-show="index === 0"></span>
				</li>
			</ul>
			<!--===========选项卡二级列表==============-->
			<ul class="tabchild" v-show="showchioce" v-for="(tabitem, index) in tabList" :key="index">
				<li v-for='(tabchild, index) in tabitem.children' :class="{'active': sort === tabchild.sort}" @click.prevent="selectTabChild(tabchild)" :key="index">
					{{ tabchild.name }}
				</li>
			</ul>
			<scroll class="searchgoods" ref="searchgoods" :data="goodsList" :pullup="pullup" :pulldown="pulldown" @pullup="searchMore" @pulldown="refresh">
				<div class="goodList">
					<goodItem v-for="(goods, index) in goodsList" :key="index" :goods="goods" ref="goodItem" @toDetail="toDetail"></goodItem>
				</div>
			</scroll>
			<masker ref="masker" @clickMe="closeMasker"></masker>
			<router-view></router-view>
		</div>
	</transition>
</template>

<script type="text/ecmascript-6">
	import { XHeader } from 'vux';
	import { mapGetters } from 'vuex';
	import { getSearchList } from '@/api/index';
	import Scroll from '@/components/base/scroll/scroll';
	import Masker from '@/components/base/masker/masker';
	import GoodItem from '@/components/base/good-item/good-item';

	export default {
		computed: {
			...mapGetters([
				'storeId'
			])
		},
		methods: {
			toDetail(id) {
				this.$router.push({
					path: `/searchDetail/${id}`
				});
			},
			searchMore() {
				if (!this.loadMore) {
					this.$refs.searchgoods.forceUpdate(true);
					return;
				}
				this.pageNum++;
				setTimeout(async () => {
					let searchListResult = await getSearchList(this.sort, this.storeId, this.goodsName, this.pageNum, this.pageSize);
					this.goodsList = this.goodsList.concat(searchListResult.content);
					this.checkMore(searchListResult);
				}, 1000);
			},
			refresh() {
				this.pageNum = 0;
				setTimeout(() => {
					this.getSearchResult();
				}, 1000);
			},
			checkMore(data) {
				this.loadMore = !data.isLast;
				this.$refs.searchgoods.forceUpdate(data.isLast);
			},
			async getSearchResult() {
				let searchResult = await getSearchList(this.sort, this.storeId, this.goodsName, this.pageNum, this.pageSize);
				console.log(searchResult);
				this.goodsList = searchResult.content;
				this.checkMore(searchResult);
				this.$vux.loading.hide();
			},
			selectTab(item, index) {
				if (item.sort === 'DATE_TIME_DESC') {
					this.sort = item.sort;
					this.showchioce = false;
				} else {
					this.showchioce = !this.showchioce;
				}
			},
			selectTabChild(item) {
				this.sort = item.sort;
				this.tabList[0].sort = item.sort;
				this.tabList[0].name = item.name;
				this.showchioce = false;
			},
			closeMasker() {
				this.showchioce = false;
			}
		},
		created() {
			if (!this.storeId) {
				return;
			}
			this.goodsName = this.$route.query.goodsName;
			this.getSearchResult();
		},
		deactivated() {
			this.$destroy();
		},
		data () {
			return {
				goodsList: [],
				goodsName: '',
				sort: 'DATE_TIME_DESC',
				tabList: [{
					name: '价格排序',
					sort: '0',
					children: [{
						name: '价格从低到高',
						sort: 'PRICE_ASC'
					}, {
						name: '价格从高到低',
						sort: 'PRICE_DESC'
					}]
				}, {
					name: '最新',
					sort: 'DATE_TIME_DESC'
				}],
				showchioce: false,
				pageNum: 0,
				pageSize: 8,
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
		watch: {
			storeId(storeid) {
				if (!storeid) {
					return;
				}
				this.goodsName = this.$route.query.goodsName;
				this.getSearchResult();
			},
			sort(newSort) {
				this.pageNum = 0;
				this.getSearchResult();
			},
			showchioce(newchioce) {
				this.$refs.masker.showType(newchioce);
			}
		},
		components: {
			XHeader,
			Scroll,
			Masker,
			GoodItem
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.search-goods
	width: 100%
	position: fixed
	top: 0
	bottom: 0
	left: 0
	background: white
	z-index: 5
	font-family: "微软雅黑"
	font-size: 14px
	/* ======搜索框模块====== */
	.search-input
		box-sizing: border-box
		display: flex
		width: 100%
		height: 46px
		padding: 6px
		position: relative
		z-index: 6
		background: #EEEEEE
		top: 0
		.searchInput
			line-height: 32px
			height: 32px
			border-radius: 5px 0px 0px 5px
			background: white
			flex: 1
			outline: none
			padding-left: 12px
		.btnSearch
			display: block
			width: 30px
			height: 32px
			background: white url(./img/icon_search@2x.png) no-repeat center
			background-size: 21px 20px
			border-radius: 0px 5px 5px 0px
			padding-left: 8px
			flex: 0 0 30px
		span
			width: 50px
			height: 32px
			line-height: 32px
			text-align: center
	/* ======选项卡====== */
	.tablist
		width: 100%
		height: 40px
		background: white
		box-sizing: border-box
		padding: 8px 0
		border-bottom: 1px solid #DBDBDB
		display: flex
		position: relative
		z-index: 6
		li
			flex: 1
			text-align: center
			line-height: 23px
			border-right: 1px solid #D9D9D9
			.icon_down
				width: 9px
				height: 4px
				display: inline-block
				background: url(./img/down@2x.png) no-repeat
				background-size: 9px 4px
				vertical-align: middle
				margin-top: -2px
		.active
			color: #ff5656
			.icon_down
				background: url(./img/down@2x.png) no-repeat
				background-size: 9px 4px
	/* ======子选项卡====== */
	.tabchild
		width: 100%
		height: auto
		overflow: hidden
		background: white
		position: absolute
		z-index: 10001
		.active
			color: #ff5656
		li
			width: 100%
			height: 40px
			line-height: 40px
			text-align: left
			border-bottom: 1px solid #D9D9D9
			box-sizing: border-box
			padding-left: 8px
	.searchgoods
		position: absolute
		top: 132px
		bottom: 0
		left: 0
		width: 100%
.slide-enter-active, .slide-leave-active
	transition: all 0.3s
.slide-enter, .slide-leave-to
	transform: translate3d(100%, 0, 0)
</style>