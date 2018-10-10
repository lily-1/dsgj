import axiosAjax from '@/common/js/axios';
import { ajaxRouteFormat } from '@/common/js/config';

/**
 * 获取当前商户所有商品分类类型
 * @param { String } storeId
 */
export function getModel(storeId) {
    // resetful接口参数替换
    let urlParams = {
        storeId: storeId
    };
    let ajaxRoute = ajaxRouteFormat('goodClassifyModel', urlParams);
    const configParams = {
        method: 'get',
        url: ajaxRoute
    };
    return axiosAjax(configParams);
};

/**
 * 获取当前分类所有商品
 * @param {分类id} modelId
 * @param {搜索字符} searchText
 * @param {商户id} storeid
 * @param {分页页码} pageNum
 * @param {分页大小} pageSize
 * @param {排序类型} sortType
 */
export function getClassifyGoods(modelId, searchText, storeId, pageNum, pageSize, sortType) {
    // resetful接口参数替换
    let urlParams = {
        storeId: storeId
    };
    let ajaxRoute = ajaxRouteFormat('getMallGoodList', urlParams);
    const params = {
        categoryId: modelId,
        keywords: searchText,
        page: pageNum,
        size: pageSize,
        sortType: sortType
    };
    const configParams = {
        method: 'get',
        url: ajaxRoute,
        params: params,
        unloadHide: true
    };
    return axiosAjax(configParams);
};
