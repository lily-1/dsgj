import wx from 'wx';
import store from '@/store/index';
import { urlFilter, getRouter } from '@/common/js/url';
import { REDIRECT_URL } from '@/common/js/config';

/**
 * 获取微信code
 * @param { Object } params 后端返回当前公众号等信息appid等
 * @return { String } code 微信服务器回调地址中存放code
 */
export function getWxcode(params) {
    let urlStr = window.location.href;
    // 判断是否含有code
    if (urlStr.indexOf('?') > 0 && urlStr.indexOf('&') > 0 && urlStr.indexOf('code=') > 0) {
        // 获取code开始位置
        let start = urlStr.indexOf('?') + 1;
        // 获取code结束位置
        let end = urlStr.indexOf('#');
        // 声明code变量
        let code = '';
        // 分割code数组
        let codeArr = urlStr.substring(start, end).split('&');
        // 获取code值
        codeArr.forEach((item, index) => {
            if (item.indexOf('code') >= 0) {
                code = item.split('=')[1];
                return false;
            }
        });
        return code;
    } else {
        let routeStr = getRouter(urlStr);
        let paramsStr = '';
        if (routeStr.indexOf('?') > 0) {
            let route = routeStr.split('?')[0];
            paramsStr = routeStr.split('?')[1] + '&route=' + route.substring(1, route.length);
        } else {
            paramsStr = 'route=' + routeStr.substring(1, routeStr.length);
        }
        window.location.href = REDIRECT_URL + paramsStr;
    }
}

/**
 * 获取微信配置文件wx.config
 * @param { Object } result 后端返回微信配置结果集
 * @param { Object } that 当前Vue组件
 * @return { Object } wx 微信配置完成对象
 */
export function setWxconfig(result, that) {
    wx.config({
        debug: false,
        appId: result.appId,
        timestamp: result.timestamp,
        nonceStr: result.nonceStr,
        signature: result.signature,
        jsApiList: [
            'checkJsApi',
            'chooseWXPay',
            'onMenuShareTimeline',
            'chooseImage',
            'getLocation',
            'onMenuShareAppMessage',
            'openLocation',
            'hideMenuItems'
        ]
    });
    wx.error(function (res) {
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        console.log(res);
    });
    return wx;
}

/**
 * 配置微信分享等
 * @param { Object } wx 微信对象
 * @param { String } title 分享标题
 * @param { String } desc 分享描述
 * @param { Object } that 当前Vue组件
 * @param { String } urlParamStr 处理链接
 * @return null
 */
export function setWechatshare(wx, shareParams, that) {
    // console.log(shareParams);
    // 当前所有vuex状态
    let state = store.state;
    // 配置分享
    let urlLocationStr = window.location.href;
    // 分享给别人设置参数
    let paramStr = '&appId=' + state.appId + '&componentAppId=' + state.componentAppId + '&publicId=' + state.publicId;
    let urlStr = urlLocationStr.indexOf('appId') >= 0 ? urlLocationStr : urlLocationStr + paramStr;
    wx.onMenuShareAppMessage({
        title: shareParams.title, // 分享标题
        desc: shareParams.desc, // 分享描述
        link: urlFilter(urlStr), // 分享链接
        imgUrl: shareParams.imgUrl, // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
            that.$vux.alert.show({
                content: '分享成功'
            });
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
            that.$vux.alert.show({
                content: '用户取消了分享'
            });
        },
        fail: function () {
            that.$vux.alert.show({
                content: '分享失败'
            });
        }
    });
    wx.onMenuShareTimeline({
        title: shareParams.title, // 分享标题
        link: urlFilter(urlStr), // 分享链接，该链接域名必须与当前企业的可信域名一致
        imgUrl: shareParams.pic, // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
            that.$vux.alert.show({
                content: '分享成功'
            });
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
            that.$vux.alert.show({
                content: '用户取消了分享'
            });
        },
        fail: function () {
            that.$vux.alert.show({
                content: '分享失败'
            });
        }
    });
}