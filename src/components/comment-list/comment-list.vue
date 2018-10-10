<template>
	<transition name="slide">
		<scroll class="comment-list" :data="commentList" ref="commentList" :pullup="pullup" :pulldown="pulldown" @pullup="loadMoreComment" @pulldown="refresh">
			<x-header :left-options="{backText: ''}">评论列表</x-header>
			<goodComment v-for="(item, index) in commentList" :key="index" :comment="item"></goodComment>
		</scroll>
	</transition>
</template>

<script type="text/ecmascript-6">
	import { XHeader } from 'vux';
	import { getGoodComment } from '@/api/product';
	import Scroll from '@/components/base/scroll/scroll';
	import GoodComment from '@/components/base/good-comment/good-comment';
	import Loading from '@/components/base/loading/loading';

	export default{
		methods: {
			async initData() {
				let id = this.$route.params.id;
				this.pageNum = 0;
				let commentResult = await getGoodComment(id, this.pageNum, this.pageSize);
				this.commentList = commentResult.content;
				console.log('refresh' + this.commentList.length);
				this.checkMore(commentResult);
			},
			async loadMoreComment() {
				if (!this.loadMore && this.$refs.commentList) {
					this.$refs.commentList.forceUpdate(true);
					return;
				}
				let id = this.$route.params.id;
				this.pageNum++;
				let commentResult = await getGoodComment(id, this.pageNum, this.pageSize);
				this.commentList = this.commentList.concat(commentResult.content);
				console.log('loadmore' + this.commentList.length);
				this.checkMore(commentResult);
			},
			refresh() {
				this.pageNum = 0;
				this.initData();
			},
			checkMore(data) {
				this.loadMore = !data.isLast;
				if (this.$refs.commentList) {
					this.$refs.commentList.forceUpdate(data.isLast);
				}
			}
		},
		created() {
			this.initData();
		},
		activated() {
			this.initData();
		},
		data () {
			return {
				commentList: [],
				pageNum: 0,
				pageSize: 6,
				pullup: {
					threshold: 50,
					stop: 40
				},
				pulldown: {
					threshold: 50,
					stop: 40
				},
				loadMore: true,
				loadRefresh: false
			};
		},
		components: {
			XHeader,
			Scroll,
			GoodComment,
			Loading
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.comment-list
	position: fixed
	top: 0
	bottom: 0
	left: 0
	background: #fff
	width: 100%
	z-index: 101
.slide-enter-active, .slide-leave-active
	transition: all 0.3s
.slide-enter, .slide-leave-to
	transform: translate3d(100%, 0, 0)
</style>