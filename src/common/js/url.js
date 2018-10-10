/**
 * 获取当前路由
 * @param { String } urlStr 当前路径
 * @example  http://c.tticar.com/?code=xxxx#/index?storeid=xxx
 * @return { String } router 当前路由
 * @example /index?storeId=x || /index
 */
export function getRouter(urlStr) {
    let router = urlStr.split('#')[1];
    return router;
}

/**
 * 获取url路径中所有参数
 * @param { string } urlStr 当前路径
 * @example http://c.tticar.com/#/index?openId=xxx&appId=xxx&storeId=xxxx&publicId=xxx
 * @return { Object } params 所有参数
 * @example {
 *      openId: xxx,(用户个人微信公众号标识)
 *      appId: xxx,(微信appid)
 *      storeId: xxx,(门店id)
 *      publicId: xxx(微信拖管平台id)
 * }
 */
export function getRouterParams(urlStr) {
    let params = {};
    let router = urlStr.split('#')[1]; // /index?storeId=x || /index
    if (router.indexOf('?') > 0) {
        let paramsStr = router.split('?')[1]; // storeId=x&appid=1
        let paramsArr = paramsStr.split('&');
        paramsArr.forEach((item, index) => {
            let key = item.split('=')[0];
            let value = item.split('=')[1];
            params[key] = value;
        });
        return params;
    }
    return null;
}

/**
 * 获取当前页面域名,做获取微信配置等页面
 * @param { String } urlStr 当前页面路径
 * @example http://c.tticar.com/?code=xxxx#/index?storeid=xxx
 * @return { String } str 当前域名
 * @example http://c.tticar.com/?code=xxx
 */
export function urlParse(urlStr) {
    let end = urlStr.indexOf('#');
    let str = urlStr.substring(0, end);
    return str;
};

/**
 * 过滤当前页面url,用于清空链接中的微信code
 * @param { String } urlStr 当前页面路径
 * @example http://c.tticar.com/?code=xxxx#/index
 * @return { String } urlStr 当前页面过滤路径
 * @example http://c.tticar.com/#/index
 */
export function urlFilter(urlStr) {
    let start = urlStr.indexOf('?');
    let end = urlStr.indexOf('#');
    if (end > start) {
        let str = urlStr.substring(start, end);
        return urlStr.replace(str, '');
    }
};
