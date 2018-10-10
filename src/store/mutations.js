/**
 * Created by renxunhao on 2017/12/25.
 */
import * as types from './mutation-types';

const mutations = {
	[types.SET_COMPONENTAPPID](state, componentAppId) {
		state.componentAppId = componentAppId;
	},
	[types.SET_PUBLICID](state, publicId) {
		state.publicId = publicId;
	},
	[types.SET_APPID](state, appId) {
		state.appId = appId;
	},
	[types.SET_OPENID](state, openId) {
		state.openId = openId;
	},
	[types.SET_STOREID](state, storeId) {
		state.storeId = storeId;
	},
	[types.SET_ACCESSTOKEN](state, accessToken) {
		state.accessToken = accessToken;
	},
	[types.SET_ORDERINFO](state, orderInfo) {
		state.orderInfo = orderInfo;
	},
	[types.SET_STORENAME](state, storeName) {
		state.storeName = storeName;
	}
};

export default mutations;
