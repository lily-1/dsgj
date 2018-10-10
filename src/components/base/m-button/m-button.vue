<template>
	<div class="m-button" @click="clickMe">
		<slot></slot>
	</div>
</template>

<script type="text/ecmascript-6">
	export default{
		data() {
			return {
				disabled: false
			};
		},
		methods: {
			clickMe() {
				if (this.disabled) {
					return;
				}
				this.disabled = true;
				this.$emit('clickBtn');
			},
			complete() {
				this.disabled = false;
			}
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>