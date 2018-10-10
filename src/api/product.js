import axiosAjax from '@/common/js/axios';
import { ajaxRouteFormat } from '@/common/js/config';

/*
 * 首页商品列表接口
 */
export function getGoodInfo(goodsId) {
    // resetful接口参数替换
    let urlParams = {
        goodsId: goodsId
    };
    let ajaxRoute = ajaxRouteFormat('getGoodDetail', urlParams);
    const configParams = {
        method: 'get',
        url: ajaxRoute
    };
    return axiosAjax(configParams);
};

/**
 * 获取评论接口
*/
export function getGoodComment(goodsId) {
    // resetful接口参数替换
    let urlParams = {
        goodsId: goodsId
    };
    let ajaxRoute = ajaxRouteFormat('getCommentList', urlParams);
    const configParams = {
        method: 'get',
        url: ajaxRoute
    };
    return axiosAjax(configParams);
};

/**
 * 获取订单详情接口
*/
export function getOrderInfo(skuId, buyNumber, remark) {
    let ajaxRoute = ajaxRouteFormat('userOrderConfirm');
    const params = {
        goodsSKUId: skuId,
        quantity: buyNumber,
        remark: remark
    };
    const configParams = {
        method: 'post',
        url: ajaxRoute,
        data: params
    };
    return axiosAjax(configParams);
};

/**
 * 获取套餐详情
*/
export function getComboInfo(id) {
    // resetful接口参数替换
    let urlParams = {
        packageId: id
    };
    let ajaxRoute = ajaxRouteFormat('getComboDetail', urlParams);
    const configParams = {
        method: 'get',
        url: ajaxRoute
    };
    return axiosAjax(configParams);
};

/**
 * 获取订单详情接口
*/
export function payWechat(orderId) {
    let urlParams = {
        orderId: orderId
    };
    let ajaxRoute = ajaxRouteFormat('getPayWechatConfig', urlParams);
    const configParams = {
        method: 'get',
        url: ajaxRoute
    };
    return axiosAjax(configParams);
};
