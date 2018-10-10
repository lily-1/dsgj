import axiosAjax from '@/common/js/axios';
import { ajaxRouteFormat } from '@/common/js/config';

/**
 * 获取用户个人信息
 */
export function getMemberInfo() {
    let ajaxRoute = ajaxRouteFormat('memberInfo');
    const configParams = {
        method: 'get',
        url: ajaxRoute,
        unresponse: true
    };
    return axiosAjax(configParams);
};

// 获取用户剩余套餐
export function getRemainComboList(pageSize, pageNum) {
    let ajaxRoute = ajaxRouteFormat('getUserRemainCombo');
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

// 获取用户预约记录
export function getUserAppointmentRecord(pageNum, pageSize) {
    let ajaxRoute = ajaxRouteFormat('getUserSubscribeRecord');
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

// 获取用户消费记录列表
export function getConsumeRecord(pageSize, pageNum) {
    let ajaxRoute = ajaxRouteFormat('getUserConsume');
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

// 用户获取个人资料
export function getUserInfo() {
    let ajaxRoute = ajaxRouteFormat('getUserInfo');
    const configParams = {
        method: 'get',
        url: ajaxRoute,
        unresponse: true
    };
    return axiosAjax(configParams);
};

// 用户获取个人资料
export function editUserInfo(params) {
    let ajaxRoute = ajaxRouteFormat('getUserInfo');
    const configParams = {
        method: 'put',
        url: ajaxRoute,
        unresponse: true,
        data: params
    };
    return axiosAjax(configParams);
};

// 验证用户修改手机号验证码
export function userVerifySmsCode(telNum, smsCode) {
    let ajaxRoute = ajaxRouteFormat('userVerifySmsCode');
    const params = {
        mobilePhone: telNum,
        smsCode: smsCode
    };
    const configParams = {
        method: 'put',
        url: ajaxRoute,
        data: params,
        unresponse: true
    };
    return axiosAjax(configParams);
};

/**
 * 用户完善车辆模块
 */
// 获取用户所有车辆接口
export function getUserLicenses() {
    let ajaxRoute = ajaxRouteFormat('getLicenses');
    const configParams = {
        method: 'get',
        url: ajaxRoute,
        unresponse: true
    };
    return axiosAjax(configParams);
};

// 获取用户车辆信息接口
export function getUserCarInfo(registerVehicleId) {
    let urlParams = {
        registerVehicleId: registerVehicleId
    };
    let ajaxRoute = ajaxRouteFormat('userCarDetail', urlParams);
    const configParams = {
        method: 'get',
        url: ajaxRoute
    };
    return axiosAjax(configParams);
};

// 获取车辆品牌接口
export function getCarBrand() {
    let ajaxRoute = ajaxRouteFormat('getCarBrand');
    const configParams = {
        method: 'get',
        url: ajaxRoute
    };
    return axiosAjax(configParams);
};

 // 根据车辆品牌获取车系
export function getCarSeriesByBrand(code) {
    let urlParams = {
        brandCode: code
    };
    let ajaxRoute = ajaxRouteFormat('getCarSeriesByBrand', urlParams);
    const configParams = {
        method: 'get',
        url: ajaxRoute
    };
    return axiosAjax(configParams);
};

// 根据品牌车系，获取车型
export function getCarTypeBySeries(manufacturerCode, modelName) {
    let ajaxRoute = ajaxRouteFormat('getCarTypeBySeries');
    const params = {
        manufacturerCode: manufacturerCode,
        modelName: modelName
    };
    const configParams = {
        method: 'get',
        url: ajaxRoute,
        params: params
    };
    return axiosAjax(configParams);
};

// 用户修改车辆信息
export function userChangeCarInfo(vehicleId, params) {
    let urlParams = {
        registerVehicleId: vehicleId
    };
    let ajaxRoute = ajaxRouteFormat('userCarDetail', urlParams);
    const configParams = {
        method: 'put',
        url: ajaxRoute,
        data: {
            vehicleParams: params
        }
    };
    return axiosAjax(configParams);
};

// 用户登录
export function userToLogin(mobilePhone, smsCode, openId, publicId, storeId) {
    let ajaxRoute = ajaxRouteFormat('userLogin');
    const params = {
        mobilePhone: mobilePhone,
        smsCode: smsCode,
        openId: openId,
        storeId: storeId,
        publicId: publicId
    };
    const configParams = {
        method: 'post',
        url: ajaxRoute,
        data: params,
        unresponse: true,
        notoken: true
    };
    return axiosAjax(configParams);
};

// 用户登录获取验证码
export function getUserMsg(mobilePhone, storeId) {
    let ajaxRoute = ajaxRouteFormat('getAuthorMsgcode');
    const params = {
        mobilePhone: mobilePhone,
        storeId: storeId
    };
    const configParams = {
        method: 'post',
        url: ajaxRoute,
        data: params
    };
    return axiosAjax(configParams);
};

// 用户修改手机号获取验证码
export function getUserChangeMsg(mobilePhone, storeId) {
    let ajaxRoute = ajaxRouteFormat('getChangeUserCode');
    const params = {
        mobilePhone: mobilePhone,
        storeId: storeId
    };
    const configParams = {
        method: 'post',
        url: ajaxRoute,
        data: params
    };
    return axiosAjax(configParams);
};

export function getUserCoupon(params) {
    console.log('待开发');
};
