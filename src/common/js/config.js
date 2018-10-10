const ENV = process.env.ENV_TYPE || 'DEV';

const CONFIG = {
    'DEV': {
        API_ROOT: 'http://47.100.65.175:9100/',
        API_ROOT_V2: 'http://testwx.hdz.tticar.com',
        PIC_ROOT: 'http://wx-dev.oss-cn-shanghai.aliyuncs.com/',
        REDIRECT_URL: 'http://c.tticar.com/#/wechatGetcode?'
    },
    'PROD': {
        API_ROOT: 'http://api.c.tticar.com',
        API_ROOT_V2: 'http://wx.hdz.tticar.com',
        PIC_ROOT: 'http://f.tticar.com/',
        REDIRECT_URL: 'http://wx.tticar.com/#/wechatGetcode?'
    }
};

// 接口服务器root地址
const API_ROOT_V1 = CONFIG[ENV].API_ROOT;
const API_ROOT_V2 = CONFIG[ENV].API_ROOT_V2 + '/api/wx';
// 所有接口地址
const API_URL = {
    // 微信服务
    wxopenId: API_ROOT_V2 + '/{publicId}/openid', // 获取微信openid
    wxconfig: API_ROOT_V2 + '/jssdk/signature', // 获取微信config参数
    // 首页模块
    getStoreInfo: API_ROOT_V1 + 'identity/stores/current/{storeId}/detail', // 获取店铺信息
    getSubscribe: API_ROOT_V1 + 'basic/services/categories', // 获取预约服务
    userSubmitSubscribe: API_ROOT_V1 + 'todolist/customers/memberappointment', // 提交预约记录(GET请求是获取预约记录,POST是提交预约)
    // 分类
    goodClassifyModel: API_ROOT_V1 + 'mall/goodscategory/{storeId}', // 获取商城分类模块列表(完成)
    // 商品列表接口
    getMallGoodList: API_ROOT_V1 + 'mall/goods/{storeId}', // 获取商城分类商品列表(完成)
    getGoodDetail: API_ROOT_V1 + 'mall/goods/{goodsId}/detail', // 获取商城商品详情
    getCommentList: API_ROOT_V1 + 'mall/goods/{goodsId}/comment', // 获取商城商品评论详情接口
    userOrderConfirm: API_ROOT_V1 + 'mall/order', // 用户确认订单
    getComboList: API_ROOT_V1 + 'mall/goods/{storeId}/package', // 用户获取首页套餐
    getComboDetail: API_ROOT_V1 + 'mall/goods/{packageId}/package/detail', // 用户获取套餐详情
    getPayWechatConfig: API_ROOT_V1 + 'mall/wechat/configs/pay/{orderId}', // 用户获取微信支付配置
    // 个人中心模块
    memberInfo: API_ROOT_V1 + 'identity/mall/user/current', // 获取用户信息以及是否绑定
    getUserOrderList: API_ROOT_V1 + 'mall/order', // 获取用户订单列表
    getUserRemainCombo: API_ROOT_V1 + 'basic/mall/customers/countercardlist', // 获取当前客户剩余套餐
    getUserConsume: API_ROOT_V1 + 'basic/finance/customer/vouchers/mall', // 获取客户消费记录
    getUserSubscribeRecord: API_ROOT_V1 + 'todolist/customers/memberappointment', // 查看预约记录(GET请求是获取预约记录,POST是提交预约)
    getUserInfo: API_ROOT_V1 + 'basic/mall/customers', // 获取用户信息接口(get为获取用户资料接口，put为修改用户资料)
    userVerifySmsCode: API_ROOT_V1 + 'identity/mall/account/mobilephone', // 验证用户修改手机号验证码
    getLicenses: API_ROOT_V1 + 'basic/mall/customers/licenseplates', // 获取用户车牌
    userCarDetail: API_ROOT_V1 + 'basic/mall/customers/vehicles/{registerVehicleId}', // 用户车辆信息或修改(PUT请求为修改,GET请求为获取车辆详情)
    getCarBrand: API_ROOT_V1 + 'vehicle/brand', // 获取品牌车系
    getCarSeriesByBrand: API_ROOT_V1 + 'vehicle/brand/{brandCode}/series', // 根据品牌获取车系
    getCarTypeBySeries: API_ROOT_V1 + 'vehicle/brand/series/model', // 根据品牌车系获取车型
    // 订单模块
    userCancelOrder: API_ROOT_V1 + 'mall/order/{orderId}/cancel',
    userRecivedOrder: API_ROOT_V1 + 'mall/order/{orderId}/complete',
    userCommentOrder: API_ROOT_V1 + 'mall/order/{orderId}/comment',
    // 登录模块
    getAuthorMsgcode: API_ROOT_V1 + 'mall/authentication/sms/code', // 获取验证码信息
    getChangeUserCode: API_ROOT_V1 + 'identity/mall/account/mobilephone/sms/code', // 修改手机号获取验证码
    userLogin: API_ROOT_V1 + 'mall/authentication', // 用户身份认证
    // 消息推送接口
    getBalanceInfo: API_ROOT_V1 + 'basic/finance/customer/receiptvouchers/{voucherId}',
    getWorkOrder: API_ROOT_V1 + 'basic/workorders/{workOrderId}', // 获取工单信息
    getPackagePlan: API_ROOT_V1 + 'basic/mall/customers/countercard/{counterCardId}',
    getRepaymentInfo: API_ROOT_V1 + 'basic/finance/customer/repaymentvouchers/{voucherId}'
};

// 暴露图片以及回调地址
export const PICURL = CONFIG[ENV].PIC_ROOT;
export const REDIRECT_URL = CONFIG[ENV].REDIRECT_URL;

/**
 * resetful接口url,替换参数
 * @param { String } urlTemplate 替换url
 * @example http://localhost/api/wx/{name}/{age}/{height}
 * @param { Object } params 替换参数
 * @example  obj = { name: 'rxh', age: 23, height: 16 }
 * @returns { String } urlStr 替换生成的模板
 * @example http://localhost/api/wx/rxh/23/16
 */
export const ajaxRouteFormat = (key, params) => {
    let url = API_URL[key];
    if (params === undefined || params === null || JSON.stringify(params) === '{}') {
        return url;
    }
    for (let key in params) {
        url = url.replace(new RegExp('\\{' + key + '\\}', 'g'), params[key]);
    }
    return url;
};
