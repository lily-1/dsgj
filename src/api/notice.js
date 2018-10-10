import axiosAjax from '@/common/js/axios';
import { ajaxRouteFormat } from '@/common/js/config';

/**
 * 获取用户个人信息
 */
export function getBalanceInfo(voucherId) {
    let urlParams = {
        voucherId: voucherId
    };
    let ajaxRoute = ajaxRouteFormat('getBalanceInfo', urlParams);
    const configParams = {
        method: 'get',
        url: ajaxRoute
    };
    return axiosAjax(configParams);
};

/**
 * 获取工单详细信息
 */
export function getWorkOrder(id) {
    let urlParams = {
        workOrderId: id
    };
    let ajaxRoute = ajaxRouteFormat('getWorkOrder', urlParams);
    const configParams = {
        method: 'get',
        url: ajaxRoute
    };
    return axiosAjax(configParams);
};

/**
 * 获取套餐详细信息
 */
export function getPackagePlan(id) {
    let urlParams = {
        counterCardId: id
    };
    let ajaxRoute = ajaxRouteFormat('getPackagePlan', urlParams);
    const configParams = {
        method: 'get',
        url: ajaxRoute
    };
    return axiosAjax(configParams);
};

/**
 * 获取用户个人信息
 */
export function getRepaymentInfo(voucherId) {
    let urlParams = {
        voucherId: voucherId
    };
    let ajaxRoute = ajaxRouteFormat('getRepaymentInfo', urlParams);
    const configParams = {
        method: 'get',
        url: ajaxRoute
    };
    return axiosAjax(configParams);
};
