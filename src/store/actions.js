/**
 * Created by renxunhao on 2017/12/25.
 */
import * as types from './mutation-types';
import { settoken } from '@/common/js/cache';

export const setUserInfo = function ({ commit, state }, {storeId, openId, accessToken, appId, publicId, componentAppId, storeName}) {
	commit(types.SET_OPENID, openId);
	commit(types.SET_STOREID, storeId);
	commit(types.SET_ACCESSTOKEN, accessToken);
	commit(types.SET_PUBLICID, publicId);
	commit(types.SET_APPID, appId);
	commit(types.SET_COMPONENTAPPID, componentAppId);
	commit(types.SET_STORENAME, storeName);
};

export const setAccessToken = function ({ commit, state }, { storeid, token }) {
	commit(types.SET_ACCESSTOKEN, settoken(storeid, token));
};
