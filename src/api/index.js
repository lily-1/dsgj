import axiosAjax from '@/common/js/axios';
import { ajaxRouteFormat } from '@/common/js/config';

export function getStoreInfo(storeId) {
    // resetful接口参数替换
    let urlParams = {
        storeId: storeId
    };
    let ajaxRoute = ajaxRouteFormat('getStoreInfo', urlParams);
    // 请求配置
    const configParams = {
        method: 'get',
        url: ajaxRoute
    };
    return axiosAjax(configParams);
}

/*
 * 首页搜索模块接口
 */
export function getSearchList(sort, storeId, search, pageNum, pageSize) {
    // resetful接口参数替换
    let urlParams = {
        storeId: storeId
    };
    let ajaxRoute = ajaxRouteFormat('getMallGoodList', urlParams);
    const params = {
        page: pageNum,
        size: pageSize,
        keywords: search,
        sortRule: sort
    };
    const configParams = {
        method: 'get',
        url: ajaxRoute,
        params: params,
        delayload: true
    };
    return axiosAjax(configParams);
}

/**
 * 获取预约服务
 */
export function getSubscribe() {
    let ajaxRoute = ajaxRouteFormat('getSubscribe');
    // 请求配置
    const configParams = {
        method: 'get',
        url: ajaxRoute
    };
    return axiosAjax(configParams);
};

/**
 * 获取预约条件
 */
export function userSubmitSubscribe(licensePlate, remark, date, time, serviceId, serviceName) {
    let ajaxRoute = ajaxRouteFormat('userSubmitSubscribe');
    // 请求参数
    const params = {
        licensePlate: licensePlate,
        date: date,
        time: time,
        remark: remark,
        serviceId: serviceId,
        serviceName: serviceName
    };
    // 请求配置
    const configParams = {
        method: 'post',
        url: ajaxRoute,
        data: params
    };
    return axiosAjax(configParams);
};

/**
 * 获取首页套餐接口
*/
export function getComboList(storeId, pageNum, pageSize) {
    let urlParams = {
        storeId: storeId
    };
    let ajaxRoute = ajaxRouteFormat('getComboList', urlParams);
    const params = {
        page: pageNum,
        size: pageSize
    };
    const configParams = {
        method: 'get',
        url: ajaxRoute,
        params: params
    };
    return axiosAjax(configParams);
};

/*
 * 获取门店优惠券列表
 */
export function getStoreCouponList(id, pageNum, pageSize) {
    const params = {
        pageNum: pageNum,
        pageSize: pageSize,
        storeId: id
    };
    const configParams = {
        method: 'get',
        url: '',
        params: params,
        delayload: true
    };
    return axiosAjax(configParams);
};

/*
 * 用户收取门店优惠券列表
 */
export function receiveCoupon(id) {
    const params = {
        couponId: id
    };
    const configParams = {
        method: 'get',
        url: '',
        params: params
    };
    return axiosAjax(configParams);
};

/*
 * 首页商品列表接口
 */
export function getGoodList(storeId, pageNum, pageSize) {
    // resetful接口参数替换
    let urlParams = {
        storeId: storeId
    };
    let ajaxRoute = ajaxRouteFormat('getMallGoodList', urlParams);
    const params = {
        recommend: true,
        page: pageNum,
        size: pageSize
    };
    const configParams = {
        method: 'get',
        url: ajaxRoute,
        params: params,
        delayload: true
    };
    return axiosAjax(configParams);
};
