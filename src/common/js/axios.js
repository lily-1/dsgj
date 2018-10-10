import Vue from 'vue';
import router from '@/router';
import store from '@/store';
import axios from 'axios';
import { errfun } from '@/common/js/util';

export default function axiosAjax(config) {
	return new Promise((resolve, reject) => {
		axios(config).then((result) => {
			resolve(result);
		}).catch((err) => {
			console.log(err);
		});
	});
};

// 拦截请求信息
axios.interceptors.request.use(function (config) {
	Vue.$vux.loading.show({
		text: '正在疯狂加载...'
	});
	if (!config.notoken) {
		let basicstr = store.state.accessToken || '';
		config.headers.Authorization = basicstr;
	}
	return config;
}, function (error) {
	errfun(Vue, 0);
	console.log(error);
});

// 拦截响应信息
axios.interceptors.response.use((response) => {
	const data = response.data;
	// 按最后一次请求进行节流
	let timer;
	if (timer) {
		clearTimeout(timer);
	}
	timer = setTimeout(() => {
		if (Vue.$nextTick) {
			Vue.$nextTick(() => {
				Vue.$vux.loading.hide();
			});
		} else {
			Vue.$vux.loading.hide();
		}
	}, 1000);
	if (response.config.unloadHide) {
		clearTimeout(timer);
	}
	// 查看请求是否需要直接返回结果集
	if (response.config.unresponse) {
		return data;
	}
	if (!data.code) {
		return data.result;
	} else {
		errfun(Vue, router, data.code, data.message);
	}
}, (err) => {
	errfun(Vue, 0);
	console.log(err);
});
