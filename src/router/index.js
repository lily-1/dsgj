import Vue from 'vue';
import Router from 'vue-router';

// 首页模块
const Index = r => require.ensure([], () => r(require('@/components/index/index')), 'Index');
// 首页-搜索
const Search = r => require.ensure([], () => r(require('@/components/index/search/search')), 'Search');// 搜索页面
const SearchDetail = r => require.ensure([], () => r(require('@/components/index/search/search-goods/search-goods')), 'SearchDetail');// 搜索页面
// 首页-预约模块
const Subscribe = r => require.ensure([], () => r(require('@/components/index/subscribe/subscribe')), 'Subscribe'); // 在线预约
const SubscribeDetail = r => require.ensure([], () => r(require('@/components/index/subscribe/subscribe-detail/subscribe-detail')), 'SubscribeDetail');
// 首页-门店优惠券
const StoreCouponList = r => require.ensure([], () => r(require('@/components/index/store-coupon-list/store-coupon-list')), 'StoreCouponList');// 门店优惠券列表
// 首页-门店主页
const About = r => require.ensure([], () => r(require('@/components/index/about/about')), 'About');// 门店主页
// 商品模块
const GoodClassify = r => require.ensure([], () => r(require('@/components/good-classify/good-classify')), 'GoodClassify');
// 商品详情模块
const GoodDetail = r => require.ensure([], () => r(require('@/components/good-detail/good-detail')), 'GoodDetail');// 商品详情页面
const CommentList = r => require.ensure([], () => r(require('@/components/comment-list/comment-list')), 'CommentList');// 商品评论列表
const ProductOrderConfirm = r => require.ensure([], () => r(require('@/components/product-order-confirm/product-order-confirm')), 'ProductOrderConfirm');// 确认订单页面
// 首页-套餐模块
const ComboList = r => require.ensure([], () => r(require('@/components/index/combo-list/combo-list')), 'ComboList');// 套餐列表
const ComboDetail = r => require.ensure([], () => r(require('@/components/combo-detail/combo-detail')), 'GoodDetail');// 套餐详情页面
// 个人中心模块
const UserCenter = r => require.ensure([], () => r(require('@/components/user-center/user-center')), 'UserCenter');
const UserOrderList = r => require.ensure([], () => r(require('@/components/user-center/user-order-list/user-order-list')), 'UserOrderList');// 线上订单列表
const RemainCombo = r => require.ensure([], () => r(require('@/components/user-center/user-remain-combo/user-remain-combo')), 'RemainCombo');// 用户剩余套餐
const ConsumeRecord = r => require.ensure([], () => r(require('@/components/user-center/user-consume-record/user-consume-record')), 'ConsumeRecord');// 用户消费记录
const UserCoupon = r => require.ensure([], () => r(require('@/components/user-center/user-coupon/user-coupon')), 'UserCoupon');// 用户优惠券
const UserSubscribeRecord = r => require.ensure([], () => r(require('@/components/user-center/user-subscribe-record/user-subscribe-record')), 'UserSubscribeRecord');// 用户预约记录
const UserCompleteCarinfo = r => require.ensure([], () => r(require('@/components/user-center/user-complete-carinfo/user-complete-carinfo')), 'UserCompleteCarinfo');// 用户完善车辆模块
const UserSetting = r => require.ensure([], () => r(require('@/components/user-center/user-setting/user-setting')), 'UserSetting');// 用户资料修改
const UserReviseCarinfo = r => require.ensure([], () => r(require('@/components/user-center/user-complete-carinfo/user-revise-carinfo/user-revise-carinfo')), 'UserReviseCarinfo');// 用户完善车辆
// 用户登录
const UserLogin = r => require.ensure([], () => r(require('@/components/user-center/user-login/user-login')), 'UserLogin');
// 用户消息模块
const UserBalanceNotice = r => require.ensure([], () => r(require('@/components/wechat-notice/balance-notice/balance-notice')), 'UserBalanceNotice');

Vue.use(Router);

export default new Router({
  linkActiveClass: 'active',
  routes: [{
    path: '/',
    redirect: '/index',
    component: Index
  }, {
      // 首页模块路由
      path: '/index',
      component: Index,
      children: [{
        // 首页-搜索模块
        path: '/search',
        component: Search,
        children: [{
          path: '/searchDetail',
          component: SearchDetail,
          children: [{
            path: ':id',
            component: GoodDetail,
            children: [{
              path: 'orderConfirm',
              component: ProductOrderConfirm
            }, {
              path: 'commentList',
              component: CommentList
            }]
          }]
        }]
      }, {
        // 首页-预约模块
        path: '/subscribe',
        component: Subscribe,
        children: [{
          path: '/subscribeDetail',
          component: SubscribeDetail
        }]
      }, {
        // 首页-优惠券列表
        path: '/storeCouponList',
        component: StoreCouponList
      }, {
        // 首页-门店主页模块
        path: '/about',
        component: About
      }, {
        // 首页-套餐详情
        path: '/comboDetail/:id',
        component: ComboDetail,
        children: [{
          path: 'orderConfirm',
          component: ProductOrderConfirm
        }, {
          path: 'commentList',
          component: CommentList
        }]
      }, {
        // 首页-套餐列表详情
        path: '/comboList',
        component: ComboList,
        children: [{
          path: ':id',
          component: ComboDetail,
          children: [{
            path: 'commentList',
            component: CommentList
          }, {
            path: 'orderConfirm',
            component: ProductOrderConfirm
          }]
        }]
      }, {
        // 首页-商品详情
        path: '/goodDetail/:id',
        component: GoodDetail,
        children: [{
          path: 'orderConfirm',
          component: ProductOrderConfirm
        }, {
          path: 'commentList',
          component: CommentList
        }]
      }]
  }, {
    // 商品分类模块
    path: '/goodClassify',
    component: GoodClassify,
    children: [{
      path: ':id',
      component: GoodDetail,
      children: [{
        path: 'orderConfirm',
        component: ProductOrderConfirm
      }, {
        path: 'commentList',
        component: CommentList
      }]
    }]
  }, {
    // 个人中心模块
    path: '/userCenter',
    component: UserCenter,
    children: [{
      path: '/UserOrderList',
      component: UserOrderList
    }, {
      // 用户剩余套餐
      path: '/remainCombo',
      component: RemainCombo
    }, {
      // 用户优惠券
      path: '/userCoupon',
      component: UserCoupon
    }, {
      // 用户消费记录
      path: '/consumeRecord',
      component: ConsumeRecord
    }, {
      // 用户预约记录
      path: '/subscribeRecord',
      component: UserSubscribeRecord
    }, {
      // 个人资料完善修改
      path: '/userSetting',
      component: UserSetting
    }, {
      // 完善车辆
      path: '/userCompleteCarinfo',
      component: UserCompleteCarinfo,
      children: [{
        path: '/userReviseCarinfo',
        component: UserReviseCarinfo
      }]
    }]
  }, {
    // 用户登录模块
    path: '/userLogin',
    component: UserLogin
  }, {
    path: '/UserBalanceNotice',
    component: UserBalanceNotice
  }]
});
