<template>
	<transition name="slide">
		<div class="combo-list">
			<x-header :left-options="{backText: ''}">会员套餐</x-header>
			<scroll class="combo-scroll" ref="combolist" :data="comboList" :pullup="pullup" :pulldown="pulldown" @pullup="getMoreCombo" @pulldown="refresh">
				<comboItem v-for="(combo, index) in comboList" :key="index" :combo="combo" @toDetail="toDetail"></comboItem>
			</scroll>
			<router-view></router-view>
		</div>
	</transition>
</template>

<script type="text/ecmascript-6">
	import { XHeader } from 'vux';
	import { mapGetters } from 'vuex';
	import { getComboList } from '@/api/index';
	import Scroll from '@/components/base/scroll/scroll';
	import ComboItem from '@/components/base/combo-item/combo-item';

	export default {
		methods: {
			toDetail(id) {
				this.$router.push({
					path: `/comboList/${id}`
				});
			},
			getMoreCombo() {
				if (!this.loadMore && this.$refs.combolist) {
					this.$refs.combolist.forceUpdate(true);
					return;
				}
				this.pageNum++;
				setTimeout(async () => {
					let comboListResult = await getComboList(this.storeId, this.pageNum, this.pageSize);
					this.comboList = this.comboList.concat(comboListResult.content);
					this.checkMore(comboListResult);
				}, 1000);
			},
			refresh() {
				this.pageNum = 0;
				setTimeout(() => {
					this.getComboResult();
				}, 1000);
			},
			async getComboResult() {
				let comboListResult = await getComboList(this.storeId, this.pageNum, this.pageSize);
				this.comboList = comboListResult.content;
				this.checkMore(comboListResult);
			},
			checkMore(data) {
				this.loadMore = !data.isLast;
				if (this.$refs.combolist) {
					this.$refs.combolist.forceUpdate(data.isLast);
				}
			}
		},
		created() {
			if (!this.storeId) {
				return;
			}
			this.getComboResult();
		},
		computed: {
			...mapGetters([
				'storeId'
			])
		},
		watch: {
			storeId(storeid) {
				if (!this.storeId) {
					return;
				}
				this.getComboResult();
			}
		},
		data () {
			return {
				comboList: [],
				pageNum: 0,
				pageSize: 6,
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
		components: {
			XHeader,
			Scroll,
			ComboItem
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.combo-list
	width: 100%
	position: fixed
	top: 0
	bottom: 0
	left: 0
	background: #fff
	z-index: 3
	.combo-scroll
		width: 100%
		position: absolute
		top: 47px
		bottom: 0
		left: 0
		overflow: hidden
		box-sizing: border-box
		padding: 0 8px 12px
.slide-enter-active, .slide-leave-active
	transition: all 0.3s
.slide-enter, .slide-leave-to
	transform: translate3d(100%, 0, 0)
</style>