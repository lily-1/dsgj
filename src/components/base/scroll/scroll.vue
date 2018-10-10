<template>
	<div class="scroll" ref="wrapper">
		<div class="scroll-content">
			<div ref="listWrapper" class="listWrapper">
				<slot></slot>
			</div>
			<div class="pullup-wrapper" v-if="pullup">
				<loading v-if="pullingUp"></loading>
				<div class="pullup-txt" v-if="pullingMore && data.length > 0">
					<div class="line"></div>
					<div class="txt">{{ pullUpTxt }}</div>
					<div class="line"></div>
				</div>
			</div>
		</div>
		<div class="pulldown-wrapper" v-if="pulldown" :style="pullDownStyle">
			<loading v-if="true"></loading>
		</div>
		<no-result :list="data" :indexkey="indexflag" v-if="pulldown || pullup"></no-result>
	</div>
</template>

<script type="text/ecmascript-6">
	import BScroll from 'better-scroll';
	import Loading from '@/components/base/loading/loading';
	import NoResult from '@/components/base/no-result/no-result';
	import { getRect } from '@/common/js/dom';

	export default {
		props: {
			probeType: {
				type: Number,
				default: 1
			},
			click: {
				type: Boolean,
				default: true
			},
			data: {
				type: Array,
				default: null
			},
			listenScroll: {
				type: Boolean,
				default: false
			},
			pullup: {
				type: null,
				default: false
			},
			pulldown: {
				type: null,
				default: false
			},
			refreshDelay: {
				type: Number,
				default: 200
			},
			bounce: {
				type: Boolean,
				default: true
			},
			indexflag: {
				type: Boolean,
				default: false
			}
		},
		mounted() {
			setTimeout(() => {
				this._initScroll();
			}, 20);
		},
		methods: {
			_initScroll() {
				if (!this.$refs.wrapper) {
					return;
				}
				// 设置内容至少为100%
				if (this.$refs.wrapper && (this.pulldown || this.pullup)) {
					this.$refs.listWrapper.style.minHeight = `${getRect(this.$refs.wrapper).height + 1}px`;
				}
				// 初始化滚动组件
				this.scroll = new BScroll(this.$refs.wrapper, {
					probeType: this.probeType,
					click: this.click,
					pullUpLoad: this.pullup,
					pullDownRefresh: this.pulldown,
					bounce: this.bounce
				});
				// 如果pulldown为有值，那么就开启下拉刷新
				if (this.pulldown) {
					this.scroll.on('pullingDown', () => {
						this.beforePullDown = false;
						this.pullingDown = true;
						this.pullingMore = false;
						this.$emit('pulldown');
					});
					this.scroll.on('scroll', (pos) => {
						if (!this.pulldown) {
							return;
						}
						if (this.beforePullDown) {
							this.pullDownStyle = `top:${Math.min(pos.y + this.pullDownInitTop, 10)}px`;
						} else {
							this.pullDownStyle = `top:${Math.min(pos.y - 30, 10)}px`;
						}
					});
				}
				if (this.pullup) {
					this.scroll.on('pullingUp', () => {
						this.pullingUp = true;
						this.refresh();
						this.$emit('pullup');
					});
				}
				if (this.listenScroll) {
					let me = this;
					this.scroll.on('scroll', (pos) => {
						me.$emit('scroll', pos);
					});
				}
			},
			// 启用better-scroll
			enable() {
				this.scroll && this.scroll.enable();
			},
			// 禁用better-scroll
			disable() {
				this.scroll && this.scroll.disable();
			},
			// 刷新better-scroll
			refresh() {
				this.scroll && this.scroll.refresh();
			},
			// 处理scroll上拉加载，下拉刷新后事件
			forceUpdate(dirty) {
				if (this.pulldown && this.pullingDown) {
					this.pullingDown = false;
					this._reboundPullDown().then(() => {
						this._afterPullDown();
					});
				} else if (this.pullup && this.pullingUp) {
					this.pullingUp = false;
					this.pullingMore = dirty;
					this.scroll.finishPullUp();
				}
				this.refresh();
			},
			_reboundPullDown() {
				const stopTime = 600;
				return new Promise((resolve) => {
					setTimeout(() => {
						this.scroll.finishPullDown();
						resolve();
					}, stopTime);
				});
			},
			_afterPullDown() {
				setTimeout(() => {
					this.pullDownStyle = `top:${this.pullDownInitTop}px`;
					this.beforePullDown = true;
					this.refresh();
				}, this.scroll.options.bounceTime);
			},
			reset() {
				this.pullingMore = false;
			},
			scrollToElement() {
				this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
			},
			scrollTo() {
				this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
			},
			scrollToBottom() {
				this.scroll.scrollTo(0, this.scroll.maxScrollY);
			}
		},
		created() {
			this.pullDownInitTop = -28;
		},
		data () {
			return {
				pullingUp: false,
				pullingMore: false,
				beforePullDown: true,
				pullingDown: false,
				pullDownStyle: '',
				pullUpTxt: '我都被你看光了',
				isRebounding: false
			};
		},
		watch: {
			data(newValue) {
				setTimeout(() => {
					this.refresh();
				}, this.refreshDelay);
			}
		},
		components: {
			Loading,
			NoResult
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.scroll
	.listWrapper
		width: 100%
		height: auto
		overflow: hidden
.pulldown-wrapper
	position: absolute
	width: 100%
	left: 0
.pullup-txt
	width: 100%
	height: 26px
	line-height: 26px
	display: flex
	box-sizing: border-box
	padding: 0 28px
	.line
		flex: 1
		background: url(./bg-line.png) repeat-x left center;
	.txt
		flex: 2
		text-align: center
		color: #999
		font-size: 12px
</style>
