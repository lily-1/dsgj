<template>
    <transition name="slide">
        <div class="user-login">
            <x-header :left-options="{backText: ''}">好店长</x-header>
            <div class="user-login-warn">
                抱歉,您还未进行车主认证,不能使用此功能,请输入手机号码,立即进行车主认证!
            </div>
            <div class="login-container" :class="{'active': goRegister}">
                <div class="container">
                    <div class="login">
                        <div class="user-input-box">
                            <div class="icon_must">
                                <span class="icon">*</span>手机号
                            </div>
                            <input class="user-input" type="text" placeholder="请输入手机号" v-model='tel' maxlength="11" />
                        </div>
                        <div class="user-input-box">
                            <div class="icon_must">
                                <span class="icon">*</span>验证码
                            </div>
                            <input class="user-input" type="text" placeholder="请输入验证码" v-model='msgCode' />
                            <div v-show="!showCount" @click="getCode" class="user-code">获取验证码</div>
                            <div class="count-time" v-show="showCount">
                                <countdown v-model="timer" :start="showCount" @on-finish="finish"></countdown>
                                <span>S</span>
                            </div>
                        </div>
                        <m-button class="btn btnLogin" ref="btnlogin" @clickBtn="userLogin">车主认证</m-button>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
import MButton from '@/components/base/m-button/m-button';
import { getUserMsg, userToLogin } from '@/api/usercenter';
import { errfun } from '@/common/js/util';
import { mapGetters, mapActions } from 'vuex';
import { XHeader, Countdown } from 'vux';

export default {
    methods: {
        async userLogin() {
            let errmsg = this.validateLogin();
            if (errmsg.length === 0) {
                let storeId = this.$route.query.storeId;
                let loginResult = await userToLogin(this.tel, this.msgCode, this.openId, this.publicId, storeId);
                if (!loginResult.code) {
                    loginResult = loginResult.result;
                    this.setAccessToken({
                        storeid: storeId,
                        token: loginResult.token_type + ' ' + loginResult.access_token
                    });
                    this.$router.back();
                } else {
                    errfun(this, this.$router, loginResult.code, loginResult.message);
                }
            } else {
                this.$vux.alert.show({
                    content: errmsg
                });
            }
            this.$refs.btnlogin.complete();
        },
        async getCode() {
            // 获取storeId
            let storeId = this.$route.query.storeId;
            // 验证手机号
            let errmsg = this.validateGetCode();
            if (errmsg.length === 0) {
                let codeResult = await getUserMsg(this.tel, storeId);
                if (codeResult) {
                    this.$vux.toast.show({text: '已成功发送验证码', position: 'bottom', type: 'text', width: '8.8em'});
                    this.showCount = true;
                    this.timer = 60;
                }
            } else {
                this.$vux.alert.show({
                    content: errmsg
                });
            }
        },
        validateGetCode() {
            let msg = '';
            let regstr = /^1[3456789]\d{9}$/;
            if (this.tel.length === 0) {
                msg = '手机号不能为空';
            } else if (!regstr.test(this.tel)) {
                msg = '请填写正确的手机号';
            }
            return msg;
        },
        validateLogin() {
            let msg = '';
            let regstr = /^1[3456789]\d{9}$/;
            if (this.tel.length === 0) {
                msg = '手机号不能为空';
            } else if (!regstr.test(this.tel)) {
                msg = '请填写正确的手机号';
            } else if (this.msgCode.length === 0) {
                msg = '验证码不能为空';
            }
            return msg;
        },
        finish(index) {
            this.time = 60;
            this.showCount = false;
        },
        ...mapActions([
            'setAccessToken'
        ])
    },
    deactivated() {
        this.$destroy();
    },
    data() {
        return {
            tel: '',
            msgCode: '',
            showCount: false,
            // 倒计时时间
            timer: 60,
            goRegister: false
        };
    },
    components: {
        XHeader,
        Countdown,
        MButton
    },
    computed: {
        ...mapGetters([
            'openId',
            'publicId'
        ])
    }
};
</script>

<style scoped lang="stylus">
.user-login
    position: fixed
    top: 0
    bottom: 0
    left: 0
    width: 100%
    background: #fff
    z-index: 999
    overflow: hidden
    .user-login-warn
        width: 100%
        height: 160px
        line-height: 18px
        box-sizing: border-box
        padding: 90px 32px 0
        color: #fe4354
        text-align: center
        background: #f6f6f6 url(./img/icon_warn@2x.png) no-repeat top 32px center
        background-size: 50px 44px
    .login-container
        perspective: 1000
        position: absolute
        width: 100%
        top: 206px
        bottom: 0
        left: 0
        &.active
            .container
                transform: rotateY(180deg)
        .container
            transition: 0.6s
            transform-style: preserve-3d
            width: 100%
            height: 100%
            position: relative
            .login, .register
                width: 100%
                position: absolute
                top: 0
                bottom: 0
                left: 0
                backface-visibility: hidden
                background: #fff
                padding: 0 10px
                box-sizing: border-box
            .register
                transform: rotateY(180deg)
            .user-input-box
                padding: 10px 0
                border-bottom: 1px solid #e9e9e9
                display: flex
                line-height: 22px
                .icon_must
                    flex: 0 0 70px
                    .icon
                        padding-right: 6px
                        color: #fe3f51
                        line-height: 22px
                .user-input
                    flex: 1
                    outline: none
                .user-code
                    color: #fe3f51
                    display: block
                    line-height: 20px
                    text-align: center
                    font-size: 12px
                    width: 80px
                    border: 1px solid #fe3f51
                    border-radius: 16px
                .count-time
                    display: inline-block
                    line-height: 22px
                    height: 22px
                    text-align: center
                    font-size: 13px
                    flex: 1 1 auto
                    color: #5293E5
    .btn
        width: 100%
        height: 38px
        line-height: 38px
        background: #ea0000
        border-radius: 18px
        text-align: center
        color: white
        margin-top: 36px
.slide-enter, .slide-leave-to
    transform: translate3d(0, 100%, 0)
.slide-enter-active, .slide-leave-active
    transition: all 0.3s
</style>
