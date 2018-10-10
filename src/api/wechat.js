import axiosAjax from '@/common/js/axios';
import { ajaxRouteFormat } from '@/common/js/config';
import { urlParse } from '@/common/js/url';

export function getWxOpenId(wxcode, publicId) {
    // resetful接口参数替换
    let urlParams = {
        publicId: publicId
    };
    let ajaxRoute = ajaxRouteFormat('wxopenId', urlParams);
    // 请求配置
    const params = {
        code: wxcode
    };
    const configParams = {
        method: 'get',
        url: ajaxRoute,
        params: params
    };
    return axiosAjax(configParams);
};

export function getWxconfig(publicId) {
    let ajaxRoute = ajaxRouteFormat('wxconfig');
    let urlStr = urlParse(window.location.href);
    const params = {
        currentUrl: urlStr,
        publicId: publicId
    };
    const configParams = {
        method: 'get',
        url: ajaxRoute,
        params: params
    };
    return axiosAjax(configParams);
};
