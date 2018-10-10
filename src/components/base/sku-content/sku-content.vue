<template>
	<transition name="sku-fade">
		<div class="sku-content" v-show="showsku" @click="close">
			<div class="sku-wrapper" @click.stop>
				<div class="sku-title">
					<div class="sku-avatar">
						<img v-lazy="url" />
					</div>
					<div class="sku-name">{{ name }}</div>
					<div class="icon_close" @click.stop="close">
						<span class="icon"></span>
					</div>
				</div>
				<scroll :data="sku" class="sku-sort">
					<skuItem :skuinfo="item" :key="index" :skuindex="index" v-for="(item, index) in sku"  @selectsku="selectsku"></skuItem>
				</scroll>
				<div class="sku-sure">
					<div class="sure-btn" @click="suresku">
						确定
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script type="text/ecmascript-6">
	import Scroll from '@/components/base/scroll/scroll';
	import SkuItem from '@/components/base/sku-content/sku-item/sku-item';

	export default {
		props: {
			sku: {
				type: Array,
				default: null
			},
			name: {
				type: String,
				default: ''
			},
			url: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				showsku: false,
				picpath: '',
				skuArr: []
			};
		},
		created() {
			if (!this.sku) {
				return;
			}
			this.setSkuArr();
		},
		methods: {
			show() {
				this.showsku = true;
			},
			close() {
				this.showsku = false;
			},
			setSkuArr() {
				this.sku.forEach((item, index) => {
					this.skuArr.push(1);
				});
			},
			selectsku(itemindex, id) {
				this.skuArr[itemindex] = id;
			},
			suresku() {
				let skustr = '';
				this.skuArr.forEach((item, index) => {
					skustr = skustr + (index === 0 ? item : ':' + item);
				});
				this.close();
				this.$emit('updatesku', skustr.toString());
			}
		},
		watch: {
			sku(arr) {
				if (!arr) {
					return;
				}
				this.setSkuArr();
			}
		},
		components: {
			Scroll,
			SkuItem
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.sku-content
	position: fixed
	left: 0
	right: 0
	top: 0
	bottom: 0
	z-index: 998
	width: 100%
	background: rgba(0, 0, 0, 0.3)
	&.sku-fade-enter-active
		animation: sku-fade 0.3s
		.sku-wrapper
			animation: sku-slide 0.3s
	&.sku-fade-leave-active
		animation: sku-fade 0.3s reverse
		.sku-wrapper
			animation: sku-slide 0.3s reverse
	.sku-wrapper
		width: 100%
		height: 280px
		background: #fff
		position: absolute
		bottom: 0
		left: 0
		.sku-title
			width: 100%
			height: 66px
			position: relative
			display: flex
			.sku-avatar
				flex: 0 0 110px
				width: 110px
				height: 66px
				text-align: center
				img
					width: 96px
					height: 96px
					margin: -40px auto 0
					box-sizing: border-box
					border-radius: 6px
					border: 1px solid #d9d9d9
			.sku-name
				flex: 1
				overflow: hidden
				text-overflow: ellipsis
				white-space: nowrap
				line-height: 28px
				height: 28px
			.icon_close
				flex: 0 0 30px
				width: 30px
				height: 66px
				.icon
					width: 26px
					height: 26px
					display: inline-block
					background: url(./img/icon_close.jpg) no-repeat
					background-size:  26px 26px
					margin-top: -16px
					overflow: hidden
					border-radius: 50% 50%
		.sku-sort
			width: 100%
			height: 135px
			overflow: hidden
		.sku-sure
			width: 100%
			height: 76px
			background: #fff
			-webkit-box-sizing: border-box
			box-sizing: border-box
			padding: 20px 6px
			.sure-btn
				width: 100%
				height: 100%
				background: #fe3f51
				color: #fff
				border-radius: 22px
				text-align: center
				line-height: 36px
	@keyframes sku-fadein
		0%
			opacity: 0
		100%
			opacity: 1
	@keyframes sku-slide
		0%
			transform: translate3d(0, 100%, 0)
		100%
			transform: translate3d(0, 0, 0)
</style>