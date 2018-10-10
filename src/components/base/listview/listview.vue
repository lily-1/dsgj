<template>
	<div class="listview">
		<scroll class="listview-content" ref="listview" :data="data" :listenScroll="listenScroll" :probeType="probeType" @scroll="scroll">
			<ul>
				<li v-for="(group, index) in data" class="list-group" ref="listGroup" :key="index">
					<h2 class="list-group-title">{{ group.title }}</h2>
					<ul :class="{'hot': index === 0}">
						<li v-for="(item, index) in group.items" class="list-group-item" @click.stop="selectItem(item)" :key="index">
							<img class="avatar" :src="picurl + item.url">
							<p class="name">{{ item.name }}</p>
						</li>
					</ul>
				</li>
			</ul>
		</scroll>
		<div class="list-shortcut">
			<ul>
				<li v-for="(item, index) in shortcutList" class="item" :data-index="index"  :class="{'current': currentIndex === index}" @touchstart.stop="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove" :key="index">
					{{ item }}
				</li>
			</ul>
		</div>
		<div class="list-fixed" ref="fixed" v-show="fixedTitle">
			<div class="fixed-title">{{ fixedTitle }} </div>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
	import Scroll from '@/components/base/scroll/scroll';
	import { getData } from '@/common/js/dom';
	import { PICURL } from '@/common/js/config';

	let ANCHOR_HEIGHT = window.screen.width > 320 ? 20 : 16;
	const TITLE_HEIGHT = 30;

	export default {
		props: {
			data: {
				type: Array,
				default: null
			}
		},
		methods: {
			onShortcutTouchMove(e) {
				let firstTouch = e.touches[0];
				this.touch.y2 = firstTouch.pageY;
				let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0;
				let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
				this._scroll(anchorIndex);
			},
			onShortcutTouchStart(e) {
				let anchorIndex = getData(e.target, 'index');
				let firstTouch = e.touches[0];
				this.touch.y1 = firstTouch.pageY;
				this.touch.anchorIndex = anchorIndex;
				this._scroll(anchorIndex);
			},
			scroll(pos) {
				this.scrollY = pos.y;
			},
			_scroll(index) {
				if (!index && index !== 0) {
					return;
				}
				if (index < 0) {
					index = 0;
				} else if (index > this.listHeight.length - 2) {
					index = this.listHeight.length - 2;
				}
				this.scrollY = -this.listHeight[index];
				this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0);
			},
			refresh() {
				this.$refs.listview.refresh();
			},
			selectItem(item) {
				this.$emit('next', item);
			},
			_calculateHeight() {
				this.listHeight = [];
				const list = this.$refs.listGroup;
				let height = 0;
				this.listHeight.push(height);
				for (let i = 0; i < list.length; i++) {
					const item = list[i];
					height += item.clientHeight;
					this.listHeight.push(height);
				}
			}
		},
		watch: {
			data() {
				setTimeout(() => {
					this._calculateHeight();
				}, 20);
			},
			scrollY(newY) {
				const listHeight = this.listHeight;
				// 当滚动到顶部，再往下拉，则newY > 0
				if (newY > 0) {
					this.currentIndex = 0;
					return;
				}
				// 在中间部分滚动
				// 循环到数组长度-1为止是因为数组的值为歌手列表的上下高度值，数组长度本身比歌手列表长度多1
				for (let i = 0; i < listHeight.length - 1; i++) {
					// 列表区间下限（小值）
					let height1 = listHeight[i];
					// 列表区间上限（大值）
					let height2 = listHeight[i + 1];
					if (-newY >= height1 && -newY < height2) {
						this.currentIndex = i;
						this.diff = height2 + newY;
						return;
					}
				}
				// 当滚动到底部，再往上拉，则-newY大于最后一个元素的上限高度值
				this.currentIndex = listHeight.length - 2;
			},
			diff(newVal) {
				// 初始之时，下一个Title未顶到上一个Title时，fixedTop值为0
				let fixedTop = newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0;
				if (this.fixedTop === fixedTop) {
					// 第一次不执行
					return;
				}
				this.fixedTop = fixedTop;
				this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`;
			}
		},
		created() {
			this.listenScroll = true;
			this.probeType = 3;
			this.touch = [];
			this.listHeight = [];
		},
		computed: {
			shortcutList() {
				return this.data.map((group) => {
					return group.title.substr(0, 1);
				});
			},
			fixedTitle() {
				if (this.scrollY > 0) {
					return;
				}
				return this.data[this.currentIndex] ? this.data[this.currentIndex].title : '';
			}
		},
		data () {
			return {
				scrollY: -1,
				currentIndex: 0,
				diff: -1,
				picurl: PICURL
			};
		},
		components: {
			Scroll
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.listview
	position: relative
	width: 100%
	height: 100%
	overflow: hidden
	.listview-content
		width: 100%
		height: 100%
		overflow: hidden
		.list-group
			padding-bottom: 30px
			.list-group-title
				height: 30px
				line-height: 30px
				padding-left: 10px
				font-size: 14px
			.list-group-item
				display: flex
				align-items: center
				padding: 20px 0 0 30px
				@media only screen and (max-width: 320px)
					padding: 10px 0 0 20px
				.avatar
					width: 50px
					height: 50px
				.name
					margin-left: 20px
					font-size: 14px
			.hot
				height: auto
				overflow: hidden
				box-sizing: border-box
				padding-right: 20px
				.list-group-item
					width: 25%
					float: left
					padding: 0
					display: inline-block
					text-align: center
					.avatar
						width: 50px
						height: 50px
					.name
						font-size: 14px
						margin: 0
	.list-shortcut
		position: absolute
		z-index: 30
		right: 0
		top: 50%
		transform: translateY(-50%)
		width: 20px
		padding: 20px 0
		border-radius: 10px
		text-align: center
		font-family: Helvetica
		.item
			padding: 3px
			line-height: 1
			font-size: 14px
			@media only screen and (max-width: 320px)
				padding: 1px
			&.current
				color: red
	.list-fixed
		position: absolute
		top: 0
		left: 0
		width: 100%
		.fixed-title
			height: 30px
			line-height: 30px
			padding-left: 10px
			font-size: 14px
			background: #fff
</style>
