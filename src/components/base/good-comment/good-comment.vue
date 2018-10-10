<template>
	<div class="user-comment" :class="{'no-border': noborder}">
		<div class="user-info">
			<div class="user-avatar">
				<img class="avatar" v-lazy="comment.mallUser.headimgurl" />
			</div>
			<div class="user-info-content">
				<p class="user-name">
					<span class="name">{{ comment.user.accountName }}</span>
					<span class="level">{{ comment.cardName }}</span>
				</p>
				<p class="user-time">{{ comment.createTime }}</p>
			</div>
		</div>
		<div class="user-comment-info">
			<p class="comment-level">{{ comment.level | commentLevel }}</p>
			<p class="comment-text">{{ comment.content }}</p>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">
	export default{
		props: {
			comment: {
				type: Object,
				default: null
			},
			noborder: {
				type: Boolean,
				default: false
			}
		},
		filters: {
			commentLevel(level) {
				let levelStr = '';
				switch (level) {
					case 'GOOD':
						levelStr = '好评';
						break;
					case 'MIDDLE':
						levelStr = '中评';
						break;
					case 'BAD':
						levelStr = '差评';
						break;
					default:
						break;
				}
				return levelStr;
			}
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.user-comment
	width: 100%
	height: auto
	overflow: hidden
	box-sizing: border-box
	padding: 0 10px
	border-bottom: 10px solid #f0f1f2;
	.user-info
		width: 100%
		border-bottom: 1px solid #f2f2f2
		padding-bottom: 10px
		display: flex
		.user-avatar
			flex: 0 0 60px
			width: 60px
			height: 60px
			display: inline-block
			border: 2px solid #f2f2f2
			border-radius: 50% 50%
			overflow: hidden
			.avatar
				width: 100%
		.user-info-content
			flex: 1
			font-size: 14px
			box-sizing: border-box
			padding-left: 10px
			line-height: 32px
			.user-name
				width: 100%
				display: flex
				font-size: 14px
				span
					display: inline-block
				.name
					color: #333
					flex: 1
					font-weight: 600
				.level
					flex: 0 0 80px
					width: 80px
					color: #f9c20e
					overflow: hidden
					text-overflow: ellipsis
					white-space: nowrap
			.user-time
				color: #989898
	.user-comment-info
		width: 100%
		padding: 10px 0px
		line-height: 20px
		display: flex
		.comment-level
			flex: 0 0 36px
			width: 36px
			color: #333
		.comment-text
			flex: 1
			box-sizing: border-box
			padding-left: 10px
			color: #999
.no-border
	border: 0
</style>