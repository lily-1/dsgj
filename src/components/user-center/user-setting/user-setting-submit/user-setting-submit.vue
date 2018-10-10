<template>
    <transition name="slide">
        <div class="user-setting-submit">
            <x-header :left-options="{backText: '', preventGoBack: true}" @on-click-back="back">{{ title }}</x-header>
            <div class="user-set-box">
                <!--修改姓名-->
                <div class="user-set user-setting-name" v-if="title === '修改姓名'">
                    <div class="title">
                        <p class="icon">*</p>
                        <p class="text">姓名</p>
                    </div>
                    <input class="value" type="text" :placeholder="userInfo.name" v-model="userInfo.name" maxlength="11" />
                </div>
                <!--修改手机号-->
                <div class="user-set user-setting-telNum" v-if="title === '修改手机号'">
                    <div class="title">
                        <p class="icon">*</p>
                        <p class="text">手机号</p>
                    </div>
                    <input class="value" placeholder="请输入新手机号" type="text" v-model="contactTelephone" maxlength="11" />
                </div>
                <!--验证手机号-->
                <div class="user-set user-setting-msgcode" v-if="title === '修改手机号'">
                    <div class="title">
                        <p class="icon">*</p>
                        <p class="text">验证码</p>
                    </div>
                    <input class="value" placeholder="请输入验证码" type="text" v-model="userInfo.msgCode" maxlength="4" />
                    <div v-show="!showCount" @click="getCode" class="user-code">获取验证码</div>
                    <div class="count-time" v-show="showCount">
                        <countdown v-model="timer" :start="showCount" @on-finish="finish"></countdown>
                        <span>S</span>
                    </div>
                </div>
                <!--验证手机号-->
                <div class="user-set user-setting-address" v-if="title === '修改地址'">
                    <div class="title">
                        <p class="icon">*</p>
                        <p class="text">地址</p>
                    </div>
                    <input class="value" type="text" :placeholder="userInfo.address" v-model="userInfo.address" />
                </div>
                <m-button class="btnSubmit" ref="setSubmit"  @clickBtn="submitSetting">提交</m-button>
            </div>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
import MButton from '@/components/base/m-button/m-button';
import { XHeader, Countdown } from 'vux';
import { getUserChangeMsg, userVerifySmsCode } from '@/api/usercenter';

export default {
    props: {
        data: {
            type: Object,
            default: null
        },
        title: {
            type: String,
            default: ''
        }
    },
    methods: {
        async submitSetting() {
            let params = {};
            if (this.title === '修改姓名') { // 修改姓名
                params.name = this.userInfo.name;
                if (this.validateString(params.name)) {
                    this.$emit('change', params);
                }
            } else if (this.title === '修改地址') {
                params.address = this.userInfo.address;
                if (this.validateString(params.address)) {
                    this.$emit('change', params);
                }
            } else {
                let telNum = this.contactTelephone;
                let smsCode = this.userInfo.msgCode;
                if (this.validatePhone(telNum, smsCode)) {
                    let verifySmsCodeResult = await userVerifySmsCode(telNum, smsCode);
                    if (!verifySmsCodeResult.code) {
                        this.$emit('changePhone', telNum);
                    } else {
                        this.$vux.toast.show({
                            text: verifySmsCodeResult.message,
                            position: 'bottom',
                            type: 'text',
                            width: '8.8em'
                        });
                    }
                }
            }
            this.resetbtn();
        },
        async getCode() {
            let telNum = this.contactTelephone;
            // 获取storeId
            let storeId = this.$route.query.storeId;
            if (this.validatePhone(telNum)) {
                let codeResult = await getUserChangeMsg(telNum, storeId);
                if (codeResult) {
                    this.$vux.toast.show({
                        text: '已成功发送验证码',
                        position: 'bottom',
                        type: 'text',
                        width: '8.8em'
                    });
                    this.showCount = true;
                    this.timer = 60;
                }
            }
        },
        validatePhone(telNum, msgCode, type) {
            let msg = '';
            let telreg = /^1[34578]\d{9}$/;
            if (telNum.length === 0) {
                msg = '手机号不能为空';
            } else if (!telreg.test(telNum)) {
                msg = '请填写正确的手机号';
            } else if (type && msgCode.length === 0) {
                msg = '验证码不能为空';
            }
            if (msg.length > 0) {
                this.validateErr(msg);
                return false;
            }
            return true;
        },
        validateString(str) {
            let msg = '';
            if (str.trim().length === 0) {
                msg = '修改内容不能为空!';
            }
            if (msg.length > 0) {
                this.validateErr(msg);
                return false;
            }
            return true;
        },
        validateErr(msg) {
            this.$vux.toast.show({
                text: msg,
                position: 'bottom',
                type: 'text',
                width: '9.2em'
            });
            this.$refs.setSubmit.complete();
        },
        back() {
            this.$emit('back');
        },
        resetbtn() {
            this.$refs.setSubmit.complete();
        },
        finish(index) {
            this.time = 60;
            this.showCount = false;
        },
        initData(value) {
            this.finish();
            this.userInfo = JSON.parse(JSON.stringify(value));
            this.userInfo.msgCode = '';
        }
    },
    data() {
        return {
            contactTelephone: '',
            userInfo: {},
            showFlag: false,
            showCount: false,
            // 倒计时时间
            timer: 60
        };
    },
    watch: {
        data(value) {
            this.initData(value);
        }
    },
    components: {
        XHeader,
        MButton,
        Countdown
    }
};
</script>

<style scoped lang="stylus">
.user-setting-submit
    width: 100%
    position: fixed
    top: 0
    bottom: 0
    left: 0
    background: #fff
    z-index: 99
    .user-set-box
        width: 100%
        box-sizing: border-box
        padding: 0 10px
        height: auto
        overflow: hidden
        .user-set
            width: 100%
            height: 24px
            line-height: 24px
            padding: 10px 0
            display: flex
            .title
                flex: 0 0 70px
                width: 70px
                display: flex
                .icon
                    width: 14px
                    flex: 0 0 14px
                    color: #fe3f51
                    padding-right: 6px
                    text-align: center
                .text
                    flex: 1
                    font-size: 14px
            .value
                flex: 1
                outline: none
                color: #969696
                font-size: 14px
                display: block
                line-height: 24px
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
        .btnSubmit
            width: 100%
            height: 40px
            line-height: 40px
            color: #fff
            text-align: center
            background: #fe3f51
            border-radius: 20px
            font-size: 16px
            margin-top: 20px
.slide-enter-active, .slide-leave-active
    transition: all 0.3s
.slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
