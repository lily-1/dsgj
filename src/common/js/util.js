import { urlFilter } from '@/common/js/url';

/**
 * 错误处理函数
 * @param { Object } that 当前Vue组件环境
 * @param { Object } router 当前Vue-Router对象
 * @param { Number } code 错误码
 * @param { String } msg 接口返回错误提示信息
 * @return null
 */
export function errfun(that, router, code, msg) {
    // 默认错误提示
    if (msg === '' || !msg) {
        msg = '遇到点问题,技术人员正在抢修(っ ̯ -っ)';
    };
    // 所有隐藏加载动画
    that.$vux.loading.hide();
    code = parseFloat(code);
    if (code < 9100 && code >= 9000) {
        // 用户token失效
        that.$vux.confirm.show({
            title: '提示',
            content: '您还没有登录,快去登录吧！',
            onConfirm() {
                router.push({
                    path: '/userLogin',
                    query: {
                        'storeId': that.storeId
                    }
                });
            },
            onCancel() {
                router.back();
            }
        });
    } else if (code === 40000) {
        // code失效重新加载页面
        let urlstr = urlFilter(window.location.href);
        window.location.href = urlstr;
    } else if (code === 20001) {
        // 商品数量以及规格为0
        that.$vux.alert.show({
            content: '请选择商品规格以及数量',
            onHide() {
                router.back();
            }
        });
    } else if (code === 30008) {
        that.$vux.toast.show({
            text: msg,
            position: 'bottom',
            type: 'text',
            width: '8.8em'
        });
    } else {
        // 代码发生错误抛错,不做任何操作
        that.$vux.alert.show({
            content: msg,
            onHide() {
                router.back();
            }
        });
    }
}

export function jsonValidate(jsonstr) {
    let isJson = false;
    try {
        if (typeof JSON.parse(jsonstr) === 'object') {
            isJson = true;
        }
    } catch (e) {
        console.log(e);
    }
    return isJson;
}
