<template>
	<transition name="slide">
		<div class="subscribe-detail">
			<x-header :left-options="{backText: ''}">预约时间</x-header>
			<scroll :data="time" class="subscribe-detail-box">
				<!--预约项目信息-->
				<div class="subscribe-info">
					<div class="subscribe-background">
						<img src="../img/subscribe-bg@2x.png" />
					</div>
					<div class="subscribe-project info">
						<p class="title">预约项目:</p>
						<p class="project-name text ellipsis">{{ projectName }}</p>
					</div>
					<div class="subscribe-date info">
						<p class="title">预约时间:</p>
						<datetime class="text" v-model="selectDate"
							:format="format"
							:start-date="today"
							:title="('start time')"
							:confirm-text="('确定')"
							:cancel-text="('取消')"
							@on-change="change">
							<span class="date">{{ selectDate }}</span>
							<span class="icon_chioce"></span>
						</datetime>
					</div>
				</div>
				<!--所有时间-->
				<div class="subscribe-time">
					<ul class="subscribetime-content">
						<li class="subscribetime-line" v-for="(timeLine, index) in calculateTime"
							:key="index">
							<!--flag为1过期 0为未过期，value为选中时间的下标-->
							<p v-for="(time, index) in timeLine" @click="_selectTime(time)" class="subscribetime-item"
								:key="index"
								:class="{'active':timecurrent === time.current, 'overdue':time.overdueFlag===1}">
								{{ time.text }}
							</p>
						</li>
					</ul>
				</div>
				<!--备注-->
				<div class="remark">
					<span class="icon_remark"></span>
					<span class="remark-name">备注:</span>
					<group>
						<x-textarea v-model="makeRemarks" :max="50" :height="50" placeholder="请输入预约备注"></x-textarea>
					</group>
				</div>
				<!--button-->
				<div class="subscribebtn">
					<m-button class="button" @clickBtn="_submitsubscibe" ref="submitBtn" :class="{active: selectTime == ''}">提交</m-button>
				</div>
			</scroll>
		</div>
	</transition>
</template>

<script type="text/ecmascript-6">
	import { XHeader, Datetime, TransferDom, Group, XTextarea } from 'vux';
	import { userSubmitSubscribe } from '@/api/index';
	import { formatDate } from '@/common/js/date';
	import Scroll from '@/components/base/scroll/scroll';
	import MButton from '@/components/base/m-button/m-button';

	export default {
		methods: {
			// 更改日期，当天几点时间更新
			change(value) {
				this.selectTime = '';
				this.selectDate = value;
				this.timecurrent = -1;
			},
			// 选择时间
			_selectTime(time) {
				if (!time.text) {
					return;
				}
				if (this.timecurrent === time.current) {
					this.timecurrent = -1;
					this.selectTime = '';
					return;
				} else if (time.overdueFlag) {
					return;
				} else {
					this.timecurrent = time.current;
				}
				// 每天预约时间text
				this.selectTime = time.text + ':00';
			},
			// 提交预约记录
			async _submitsubscibe() {
				if (this.selectTime !== '') {
					let that = this;
					let licensePlate = this.$route.query.licensePlate;
					let projectId = this.$route.query.projectId;
					let subscribeResult = await userSubmitSubscribe(licensePlate, this.makeRemarks, this.selectDate, this.selectTime, projectId, this.projectName);
					if (subscribeResult) {
						this.$vux.alert.show({
							content: '预约成功',
							onHide () {
								that.$router.back();
							}
						});
					}
					this.$refs.submitBtn.complete();
				}
			}
		},
		created() {
			this.projectName = this.$route.query.projectName;
			let datetoday = new Date(); // 获取今天日期
			this.selectDate = this.today = formatDate(datetoday, 'yyyy-MM-dd'); // 选中日期默认为今天
		},
		computed: {
			// 计算属性
			calculateTime () {
				let nowdate = new Date();
				let selectdate = this.selectDate;
				this.time.forEach(function(item) {
					item.forEach(function(item) {
						let strtime = selectdate + ' ' + item.text + ':00';
						strtime = strtime.replace(/-/g, '/');
						var date = new Date(strtime);
						item.overdueFlag = date < nowdate ? 1 : 0;
					});
				});
				return this.time;
			}
		},
		data() {
			return {
				makeRemarks: '',
				// 选择时间
				selectTime: '',
				// 选择日期
				selectDate: '',
				// 今日日期
				today: '',
				// 设置日期格式
				format: 'YYYY-MM-DD',
				// 项目名称
				projectName: '',
				// 选择时间下标
				timecurrent: -1,
				// 所有日期
				time: [
					[{
						'current': 0,
						'text': '09:00',
						'overdueFlag': 0
					}, {
						'current': 1,
						'text': '09:30',
						'overdueFlag': 0
					}, {
						'current': 2,
						'text': '10:00',
						'overdueFlag': 0
					}],
					[{
						'current': 3,
						'text': '10:30',
						'overdueFlag': 0
					}, {
						'current': 4,
						'text': '11:00',
						'overdueFlag': 0
					}, {
						'current': 5,
						'text': '11:30',
						'overdueFlag': 0
					}],
					[{
						'current': 6,
						'text': '12:00',
						'overdueFlag': 0
					}, {
						'current': 7,
						'text': '12:30',
						'overdueFlag': 0
					}, {
						'current': 8,
						'text': '13:00',
						'overdueFlag': 0
					}],
					[{
						'current': 9,
						'text': '13:30',
						'overdueFlag': 0
					}, {
						'current': 10,
						'text': '14:00',
						'overdueFlag': 0
					}, {
						'current': 11,
						'text': '14:30',
						'overdueFlag': 0
					}],
					[{
						'current': 12,
						'text': '15:00',
						'overdueFlag': 0
					}, {
						'current': 13,
						'text': '15:30',
						'overdueFlag': 0
					}, {
						'current': 14,
						'text': '16:00',
						'overdueFlag': 0
					}],
					[{
						'current': 15,
						'text': '16:30',
						'overdueFlag': 0
					}, {
						'current': 16,
						'text': '17:00',
						'overdueFlag': 0
					}, {
						'current': '',
						'text': '',
						'overdueFlag': 0
					}]
				]
			};
		},
		directives: {
			TransferDom
		},
		components: {
			XHeader,
			Datetime,
			Group,
			XTextarea,
			Scroll,
			MButton
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.subscribe-detail
	position: fixed
	top: 0
	bottom: 0
	left: 0
	width: 100%
	background: #fff
	z-index: 100
	.subscribe-detail-box
		position: absolute
		top: 47px
		bottom: 0
		left: 0
		width: 100%
		overflow: hidden
		.subscribe-info
			width: 100%
			height: 100px
			overflow: hidden
			position: relative
			.subscribe-background
				width: 100%
				height: 100%
				padding-bottom: 14px
				position: absolute
				top: 0
				left: 0
				img
					display: block
					width: 100%
					height: 100px
			.info
				width: 230px
				height: 20px
				line-height: 20px
				display: flex
				font-size: 14px
				position: absolute
				z-index: 10
				top: 42px
				.title
					flex: 0 0 75px
					width: 75px
					text-align: center
					color: white
				.text
					flex: 1
					box-sizing: border-box
					border-radius: 3px
					display: flex
			.subscribe-project
				top: 12px
				.text
					color: #fff
			.subscribe-date
				.text
					flex: 1
					box-sizing: border-box
					background: white
					border-radius: 3px
					display: flex
					.date
						flex: 1
						box-sizing: border-box
						padding-left: 12px
					.icon_chioce
						flex: 0 0 20px
						width: 20px
						box-sizing: border-box
						background: url(../img/icon_down.png) no-repeat center center
						background-size: 12px 6px
						border-left: 1px solid #D9D9D9
		.subscribe-time
			width: 100%
			box-sizing: border-box
			padding: 14px 6px
			.subscribetime-content
				width: 100%
				box-sizing: border-box
				border: 1px solid #D9D9D9
				.subscribetime-line
					width: 100%
					line-height: 38px
					display: flex
					box-sizing: border-box
					border-bottom: 1px solid #D9D9D9
					.active
						color: #FE3F51
						background: #F0F1F3 url(./icon_selected.png) no-repeat right bottom
						background-size: 20px 20px
					.overdue
						color: #D9D9D9
					&:last-child
						border: 0
					.subscribetime-item
						flex: 1
						display: inline-block
						box-sizing: border-box
						border-right: 1px solid #D9D9D9
						text-align: center
						&:last-child
							border: 0
		.remark
			box-sizing: border-box
			padding-top: 10px
			margin: 0px 6px 24px 6px
			background: #f6f8fc
			.remark-name
				line-height: 20px
				display: block
				padding-left: 20px
				background: url(./icon_edit@2x.png) no-repeat left center
				background-size: 14px 14px
			.weui-cells
				margin-top: 0
			.weui-cell
				background: #f6f8fc
				margin-top: none
				textarea
					background: #f6f8fc
					font-family: "微软雅黑"
					font-size: 14px
		.subscribebtn
			width: 100%
			box-sizing: border-box
			padding: 0 6px
			.button
				border-radius: 22px
				width: 100%
				background: #FE3F51
				color: white
				text-align: center
				line-height: 36px
				margin-bottom: 36px
				&.active
					background: #dcdcdc
.slide-enter, .slide-leave-to
	transform: translate3d(100%, 0, 0)
.slide-enter-active, .slide-leave-active
	transition: all 0.3s
</style>