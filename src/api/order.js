import axiosAjax from '@/common/js/axios';
import { ajaxRouteFormat } from '@/common/js/config';
const qs = require('qs');

/**
 * 获取用户个人信息
 */
export function getUserOrderList(status, pageNum, pageSize) {
    let type = status.split(',');
    let ajaxRoute = ajaxRouteFormat('getUserOrderList');
    const params = {
        status: type,
        page: pageNum,
        size: pageSize
    };
    const configParams = {
        method: 'get',
        url: ajaxRoute,
        params: params,
        paramsSerializer: function (params) {
            return qs.stringify(params, { arrayFormat: 'repeat' });
        }
    };
    return axiosAjax(configParams);
};

/**
 * 用户取消订单
 */
export function commentOrder(orderid, content, level) {
    let urlParams = {
        orderId: orderid
    };
    let ajaxRoute = ajaxRouteFormat('userCommentOrder', urlParams);
    const params = {
        content: content,
        level: level
    };
    const configParams = {
        method: 'post',
        url: ajaxRoute,
        data: params
    };
    return axiosAjax(configParams);
};

/**
 * 用户取消订单
 */
export function cancelOrder(orderid) {
    let urlParams = {
        orderId: orderid
    };
    let ajaxRoute = ajaxRouteFormat('userCancelOrder', urlParams);
    const configParams = {
        method: 'put',
        url: ajaxRoute
    };
    return axiosAjax(configParams);
};

/**
 * 用户接收订单
 */
export function recivedOrder(orderid) {
    let urlParams = {
        orderId: orderid
    };
    let ajaxRoute = ajaxRouteFormat('userRecivedOrder', urlParams);
    const configParams = {
        method: 'put',
        url: ajaxRoute
    };
    return axiosAjax(configParams);
};
