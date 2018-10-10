<template>
	<transition name="opacity">
		<div class="masker" v-show="showMasker" @click="closeMasker">
		</div>
	</transition>
</template>

<script type="text/ecmascript-6">
	export default {
		data () {
			return {
				showMasker: false
			};
		},
		methods: {
			showType(showMasker) {
				this.showMasker = showMasker;
			},
			closeMasker() {
				this.showMasker = false;
				this.$emit('clickMe');
			}
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.masker
	position: absolute
	top: 0
	left: 0
	bottom: 0
	width: 100%
	background: rgba(0, 0, 0, 0.3)
	z-index: 5
.opacity-enter-active
	animation: masker-fadein 0.3s
.opacity-leave-active
	animation: masker-fadein 0.3s reverse
@keyframes masker-fadein
		0%
			opacity: 0
		100%
			opacity: 1
</style>