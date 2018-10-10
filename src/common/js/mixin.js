import { mapGetters, mapMutations } from 'vuex';
// 获取微信配置函数,设置微信分享函数
import { setWxconfig, setWechatshare } from '@/common/js/wechat';
import { mapbdtotx } from '@/common/js/gcoord';
import { getWxconfig } from '@/api/wechat';
import { getMemberInfo } from '@/api/usercenter';

export const wechatMixin = {
    computed: {
        ...mapGetters([
            'storeId',
            'publicId'
        ])
    },
    methods: {
        async getWxObject() {
            // 设置分享
            // 请求微信签名
            let wxResult = await getWxconfig(this.publicId);
            // 配置微信wx.config, 返回wx对象
            let wx = await setWxconfig(wxResult);
            return wx;
        },
        async wechatToShare(shareParams) {
            let wx = await this.getWxObject();
            setWechatshare(wx, shareParams, this);
        },
        async toMap() {
            if (!this.publicId) {
                return;
            }
            let storeResult = this.storeInfo;
            let wx = await this.getWxObject();
            if (!storeResult.longitude || !storeResult.latitude) {
                this.$vux.alert.show({
                    content: '门店地址飞走啦'
                });
            } else {
                let pos = mapbdtotx(storeResult.longitude, storeResult.latitude);
                wx.ready(function () {
                    wx.openLocation({
                        latitude: pos[1], // 纬度，浮点数，范围为90 ~ -90
                        longitude: pos[0], // 经度，浮点数，范围为180 ~ -180。
                        name: storeResult.storeName, // 位置名
                        address: storeResult.address, // 地址详情说明
                        scale: 16 // 地图缩放级别,整形值,范围从1~28。默认为最大
                    });
                });
            }
        }
    }
};

export const routerMixin = {
    beforeRouteEnter(to, from, next) {
        next((that) => {
            that.initData();
        });
    }
};

export const customerMixin = {
    methods: {
        async isCustomer() {
            let flag = true;
            let memberResult = await getMemberInfo();
            if (!memberResult.code) {
                flag = memberResult.result.hasCustomer;
            } else {
                if (memberResult.code !== 9005 && memberResult.code !== 9004 && memberResult.code !== 9002) {
                    flag = false;
                }
            }
            return flag;
        }
    }
};

export const productMixin = {
    methods: {
        addNum(event) {
            this.productNum++;
            this._drop(event.target);
        },
        reduceNum() {
            if (this.productNum <= 1) {
                console.log('不能再减了');
            } else {
                this.productNum--;
            }
        },
        loadMoreComment() {
            let id = this.$route.params.id;
            this.$router.push({
                path: `${id}/commentList/`
            });
        },
        successload() {
            this.$refs.detail.refresh();
        },
        _drop(target) {
            this.$nextTick(() => {
                for (let i = 0; i < this.balls.length; i++) {
                    let ball = this.balls[i];
                    if (!ball.show) {
                        ball.show = true;
                        ball.el = target;
                        this.dropBalls.push(ball);
                        return;
                    }
                }
            });
        },
        beforeDrop(el) {
            let count = this.balls.length;
            while (count--) {
                let ball = this.balls[count];
                if (ball.show) {
                    let rect = ball.el.getBoundingClientRect();
                    let x = rect.left - 32;
                    let y = -(window.innerHeight - rect.top - 22);
                    el.style.display = '';
                    el.style.webkitTransform = `translate3d(0,${y}px,0)`;
                    el.style.transform = `translate3d(0,${y}px,0)`;
                    let inner = el.getElementsByClassName('inner-hook')[0];
                    inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
                    inner.style.transform = `translate3d(${x}px,0,0)`;
                }
            }
        },
        dropping(el, done) {
            /* eslint-disable no-unused-vars */
            let rf = el.offsetHeight;
            this.$nextTick(() => {
                el.style.webkitTransform = 'translate3d(0,0,0)';
                el.style.transform = 'translate3d(0,0,0)';
                let inner = el.getElementsByClassName('inner-hook')[0];
                inner.style.webkitTransform = 'translate3d(0,0,0)';
                inner.style.transform = 'translate3d(0,0,0)';
                el.addEventListener('transitionend', done);
            });
        },
        afterDrop(el) {
            let ball = this.dropBalls.shift();
            if (ball) {
                ball.show = false;
                el.style.display = 'none';
            }
        },
        ...mapMutations({
            'setOrderInfo': 'SET_ORDERINFO'
        })
    },
    computed: {
        ...mapGetters([
            'publicId'
        ])
    },
    created() {
        // 初始化五个小球
        for (var i = 0; i < 5; i++) {
            let ball = {
                show: false
            };
            this.balls.push(ball);
        }
        this.initData();
    }
};
