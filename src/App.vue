<template>
	<div id="app">
    <keep-alive>
			<router-view></router-view>
		</keep-alive>
		<m-footer></m-footer>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
	import { getRouter } from '@/common/js/url';
	import MFooter from '@/components/base/m-footer/m-footer';

  export default {
    methods: {
      // 处理用户自动缩放页面字体大小,导致页面错乱BUG
			handleFontSize() {
				// 设置网页字体为默认大小
				window.WeixinJSBridge.invoke('setFontSizeCallback', { 'fontSize': 0 });
				// 重写设置网页字体大小的事件
				window.WeixinJSBridge.on('menu:setfont', function() {
					window.WeixinJSBridge.invoke('setFontSizeCallback', { 'fontSize': 0 });
				});
			}
    },
    created() {
			// 处理用户自动缩放页面字体大小,导致页面错乱BUG之前,兼容性问题处理
			if (typeof window.WeixinJSBridge === 'object' && typeof window.WeixinJSBridge.invoke === 'function') {
				this.handleFontSize();
			} else {
				if (document.addEventListener) {
					document.addEventListener('WeixinJSBridgeReady', this.handleFontSize, false);
				} else if (document.attachEvent) {
					document.attachEvent('WeixinJSBridgeReady', this.handleFontSize);
					document.attachEvent('onWeixinJSBridgeReady', this.handleFontSize);
				}
			}
			// 通过用户当前路径获取当前路由,如果没有storeId,将其添加在路有中
			let routePath = getRouter(window.location.href);
			if (window.location.href.indexOf('storeId') < 0) {
				this.$router.push({
					path: routePath,
					query: {
						storeId: this.storeId
					}
				});
			}
			/**
			 * 全局导航守卫
			 * 1.路由跳转时,添加动画
			 * 2.所有链接挂在storeId,防止刷新,重置vuex状态
			 */
			this.$router.beforeEach((to, from, next) => {
				// 上方注释1
				if (to.path !== from.path) {
					this.$vux.loading.show({
						text: '玩命加载中...'
					});
				}
				// 上方注释2
				let pathStr = to.fullPath;
				if (!to.query.storeId) {
					pathStr = pathStr + (to.fullPath.indexOf('?') > -1 ? '&' : '?') + 'storeId=' + this.storeId;
					next({ path: pathStr });
				}
				next();
			});
			// 路由跳转完成关闭loading页面
			this.$router.afterEach((to, from) => {
				this.$vux.loading.hide();
				this.$vux.alert.hide();
				this.$vux.confirm.hide();
			});
		},
		components: {
			MFooter
		},
    computed: {
      ...mapGetters([
        'storeId'
      ])
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import '~common/stylus/reset'
</style>
