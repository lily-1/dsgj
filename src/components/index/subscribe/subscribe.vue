<template>
	<transition name="slide">
		<div class="subscribe">
			<x-header :left-options="{backText: ''}">在线预约</x-header>
			<!--选择车牌-->
			<div class="subscribe-carno">
				<div class="subscribe-background">
					<img src="./img/subscribe-bg@2x.png" />
				</div>
				<div class="carno-chioce" @click="selectCarno">
					<p class="carno-title">预约车辆:</p>
					<p class="carno-text">
						<span class="carno">{{ carNo }}</span>
						<span class="icon_chioce"></span>
					</p>
				</div>
			</div>
			<!--分类二级联动-->
			<div class="subscribe-classify">
				<!--菜单栏-->
				<scroll class="subscribe-menu-wrapper" :data="servicesMenu">
					<div class="menu-item" v-for="(item, index) in servicesMenu" :class="{'active': currentMenuIndex === index}" @click="selectMenu(index)" :key="index">
						<p class="item-text">{{ item.name }}</p>
					</div>
				</scroll>
				<!--分类数据-->
				<scroll class="subscribe-classify-wrapper" :data="serviceItems">
					<p class="service-item" :class="{'active':projectId===item.servicesId}" :style="{width: itemW+'px'}" v-for="(item, index) in serviceItems" @click="selectProject(item)" :key="index">{{ item.name }}</p>
				</scroll>
			</div>
			<div class="subscribeBtn">
				<p @click="subscribeService" :class="{active: projectId == ''}">预&nbsp;&nbsp;约</p>
			</div>
			<!--预约详情-->
			<router-view></router-view>
			<!--车牌号列表-->
			<actionsheet v-model="showmenu" :menus="carAllNo" @on-click-menu="clickMenu" show-cancel></actionsheet>
		</div>
	</transition>
</template>

<script type="text/ecmascript-6">
	import { XHeader, Actionsheet } from 'vux';
	import { getSubscribe } from '@/api/index';
	import { getUserLicenses } from '@/api/usercenter';
	import { routerMixin } from '@/common/js/mixin';
	import { errfun } from '@/common/js/util';
	import Scroll from '@/components/base/scroll/scroll';

	export default{
		mixins: [routerMixin],
		methods: {
			// 初始化数据
			async initData() {
				// 获取用户所有车辆
				let userLicensesResult = await getUserLicenses();
				if (!userLicensesResult.code) {
					userLicensesResult = userLicensesResult.result;
					// 当前用户在门店所有车辆
					if (userLicensesResult.length > 0) {
						this.carAllNo.length = 0;
						userLicensesResult.forEach((item, index) => {
							if (index === 0) {
								this.carNo = item.number;
							}
							let carNo = {
								label: item.number,
								value: item.number
							};
							this.carAllNo.push(carNo);
						});
					}
				} else {
					let code = userLicensesResult.code;
					errfun(this, this.$router, code, userLicensesResult.message);
					return;
				}
				// 门店预约项目集合
				let subscribeResult = await getSubscribe();
				if (!subscribeResult) {
					return;
				}
				// 门店服务菜单分类
				this.servicesMenu = subscribeResult;
				// 门店所有菜单分类子项，默认取第一个分类
				if (this.servicesMenu.length > 0) {
					this.serviceItems = this.servicesMenu[0].servicesDtos;
				}
				// 设置子项宽度
				this.$nextTick(() => {
					let itemW = document.getElementsByClassName('subscribe-classify-wrapper')[0].offsetWidth;
					this.itemW = parseInt((itemW - 40) / 2);
				});
			},
			// 点击预约按钮
			subscribeService() {
				if (this.projectId === '') {
					return;
				}
				if (this.carNo === '') {
					this.$vux.alert.show({
						content: '请联系门店添加您的车辆'
					});
					return;
				}
				this.$router.push({
					path: '/subscribeDetail',
					query: {
						'licensePlate': this.carNo,
						'projectId': this.projectId,
						'projectName': this.projectName
					}
				});
			},
			// 选择预约项目,判断当前项目
			selectProject(item) {
				if (this.projectId === item.servicesId) {
					this.projectId = '';
					this.projectName = '';
				} else {
					this.projectId = item.servicesId;
					this.projectName = item.name;
				}
			},
			// 单击选择左侧菜单
			selectMenu(index) {
				this.currentMenuIndex = index;
				this.serviceItems = this.servicesMenu[index].servicesDtos;
			},
			// 选择车牌号,展示车牌号菜单
			selectCarno() {
				this.showmenu = true;
			},
			// 点击车牌号菜单
			clickMenu(value) {
				if (value !== 'cancel') {
					this.carNo = value;
				}
			}
		},
		data () {
			return {
				// 分类列表容器宽度用于计算项目itme宽度
				itemW: 0,
				// 当前选中车牌号
				carNo: '',
				// 车牌号数据数组
				carAllNo: [],
				// 门店预约分类菜单
				servicesMenu: [],
				// 门店预约全部
				serviceItems: [],
				// 选择项目id
				projectId: '',
				// 菜单选中下标
				currentMenuIndex: 0,
				// 是否弹出选择车牌
				showmenu: false
			};
		},
		components: {
			XHeader,
			Actionsheet,
			Scroll
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.subscribe
	width: 100%
	position: fixed
	top: 0
	left: 0
	bottom: 0
	background: #fff
	z-index: 99
	.subscribe-carno
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
		.carno-chioce
			width: 230px
			height: 20px
			line-height: 20px
			display: flex
			font-size: 14px
			position: absolute
			z-index: 10
			top: 18px
			.carno-title
				flex: 0 0 75px
				width: 75px
				text-align: center
				color: white
			.carno-text
				flex: 1
				box-sizing: border-box
				background: white
				border-radius: 3px
				display: flex
				.carno
					flex: 1
					box-sizing: border-box
					padding-left: 12px
				.icon_chioce
					flex: 0 0 20px
					width: 20px
					box-sizing: border-box
					background: url(./img/icon_down.png) no-repeat center center
					background-size: 12px 6px
					border-left: 1px solid #D9D9D9
	.subscribe-classify
		width: 100%
		position: absolute
		top: 160px
		bottom: 56px
		left: 0
		border-top: 1px solid #d9d9d9
		border-bottom: 1px solid #d9d9d9
		display: flex
		.subscribe-menu-wrapper
			flex: 0 0 110px
			width: 110px
			position: relative
			overflow: hidden
			box-sizing: border-box
			border-right: 1px solid #d9d9d9
			.menu-item
				width: 100%
				height: 55px
				border-bottom: 1px solid #d9d9d9
				line-height: 55px
				text-align: center
				&:last-child
					border-bottom: 0
				.item-text
					width: 100%
					height: 100%
					overflow: hidden
					text-overflow: ellipsis
					white-space: nowrap
			.active
				color: #ff4354
				background: #ffeff0
		.subscribe-classify-wrapper
			flex: 1
			overflow: hidden
			.listWrapper
				padding: 12px 0
				.service-item
					height: 30px
					line-height: 30px
					border: 1px solid #d9d9d9
					box-sizing: border-box
					text-align: center
					margin: 10px
					float: left
					border-radius: 2px
					overflow: hidden
					text-overflow: ellipsis
					white-space: nowrap
				.active
					border-color: #FF4354
					background: url(./img/icon_select.png) no-repeat right bottom
					background-size: 20px 20px
					color: #FF4354
	.subscribeBtn
		width: 100%
		height: 56px
		background: white
		box-sizing: border-box
		padding: 10px 8px
		color: white
		text-align: center
		position: absolute
		left: 0
		bottom: 0
		z-index: 100
		p
			width: 100%
			height: 36px
			line-height: 36px
			background: #FE3F51
			border-radius: 22px
			color: white
			&.active
				background: #dcdcdc
.slide-enter, .slide-leave-to
	transform: translate3d(100%, 0, 0)
.slide-enter-active, .slide-leave-active
	transition: all 0.3s
</style>