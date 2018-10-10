import storage from 'good-storage';

export function getStoreInfoCache(storeId) {
	return storage.get(storeId);
}

export function setStoreInfoCache(storeId, storeInfo) {
	return storage.set(storeId, storeInfo);
}

export function setopenid(storeId, openid) {
	let storeInfo = storage.get(storeId) || {};
	storeInfo.openid = openid;
	storage.set(storeId, storeInfo);
	return openid;
}

export function settoken(storeId, token) {
	let storeInfo = storage.get(storeId) || {};
	storeInfo.accessToken = token || null;
	storage.set(storeId, storeInfo);
	return token;
}

export function setstoreid(storeId) {
	let storeInfo = storage.get(storeId) || {};
	storeInfo.storeId = storeId;
	storage.set(storeId, storeInfo);
	return storeId;
}
