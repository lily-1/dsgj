import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store/index';
import VueLazyLoad from 'vue-lazyload';
import FastClick from 'fastclick';
import { ToastPlugin, AlertPlugin, ConfirmPlugin, LoadingPlugin } from 'vux';
import { getWxcode } from '@/common/js/wechat';
import { getRouterParams } from '@/common/js/url';
import { getStoreInfoCache, setStoreInfoCache } from '@/common/js/cache';
import { getWxOpenId } from '@/api/wechat';
import { getStoreInfo } from '@/api/index';

/* eslint-disable no-unused-vars */
// import vConsole from 'vconsole';

Vue.config.productionTip = false;
Vue.use(ToastPlugin);
Vue.use(AlertPlugin);
Vue.use(ConfirmPlugin);
Vue.use(LoadingPlugin);

FastClick.attach(document.body);
Vue.use(VueLazyLoad, {
  loading: require('common/images/default1_1.jpg'),
  error: require('common/images/default1_1.jpg')
});

// 错误收集函数
const errorHandler = (error, vm) => {
  console.error('reportError js err', error);
};
Vue.config.errorHandler = errorHandler;
Vue.prototype.$throw = (error) => errorHandler(error, this);

// 获取用户基本信息
getBaseInfo();

async function getBaseInfo() {
  // 当前页面路径
  let urlStr = window.location.href;
  // 消息通知等仅仅展示路由
  if (urlStr.indexOf('Notice') > 0) {
    /* eslint-disable no-new */
    new Vue({
      el: '#app',
      router,
      store: store,
      render: h => h(App)
    });
    return;
  }
  // 获取路由参数
  let routerParams = getRouterParams(urlStr);
  /**
   * 路由必有storeId,但是没有openId,先获取缓存中信息
   * 如果缓存中无openId,通过code,publicId去获取openId;
   * 没有storeId提示错误
   * http://localhost:8080/#/index?openId=osWk11egS-LRBaA8uzVgGrV-aWAo&appId=wx56b98d147b1c3ec3&componentAppId=wx82827b3755843737&storeId=39184ddb64fe48bf93aed589d72c46f8&publicId=dc5a2efc08ec4a5f9f51907a1380e92b
   * http://localhost:8080/#/index?openId=osWk11egS-LRBaA8uzVgGrV-aWAo&appId=wx56b98d147b1c3ec3&componentAppId=wx82827b3755843737&storeId=39184ddb64fe48bf93aed589d72c46f8&publicId=dc5a2efc08ec4a5f9f51907a1380e92b
   */
  if (routerParams && routerParams.storeId) {
    let storeCache = getStoreInfoCache(routerParams.storeId);
    // 判断openId
    if (!routerParams.openId && (!storeCache || !storeCache.openId)) {
      // 判断缓存是否有openId用户唯一标识
      // 没有openid通过code，publicid, storeid,直接换取openid
      let code = getWxcode(routerParams);
      if (!code) {
        return;
      }
      let openidResult = await getWxOpenId(code, routerParams.publicId);
      storeCache.openId = openidResult;
    }
    if (storeCache) {
      routerParams = storeCache;
    }
  } else {
    Vue.$vux.alert.show({
      content: '请先扫描门店二维码,再绑定门店！'
    });
    return;
  }
  if (!routerParams || !routerParams.storeName) {
    let storeResult = await getStoreInfo(routerParams.storeId);
    routerParams.storeName = storeResult.name;
  }
  setVuex(routerParams);
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    store: store,
    render: h => h(App)
  });
}

/**
 * 在初始化Vue之前,根据缓存设置Vuex状态信息
 * @param { Object } params 用户基本信息
 * @return null
 */
function setVuex(storeInfo) {
  store.dispatch('setUserInfo', {
    storeId: storeInfo.storeId,
    openId: storeInfo.openId,
    accessToken: storeInfo.accessToken,
    appId: storeInfo.appId,
    publicId: storeInfo.publicId,
    componentAppId: storeInfo.componentAppId,
    storeName: storeInfo.storeName
  });
  setStoreInfoCache(storeInfo.storeId, storeInfo);
}
