<template>
    <transition name="slide">
        <div class="user-revise-carinfo-submit" v-show="showFlag">
            <x-header :left-options="{backText: '', preventGoBack: true}" @on-click-back="back">{{ title }}</x-header>
            <div class="user-set-box">
                <div class="user-set user-setting-frame" v-if="title === '修改车架号'">
                    <div class="title">
                        <p class="text">车架号</p>
                    </div>
                    <input v-if="carinfo" class="value" type="text" placeholder="请输入车架号" v-model="carinfo.frameNumber" />
                </div>
                <div class="user-set user-setting-engine" v-if="title === '修改发动机号'">
                    <div class="title">
                        <p class="text">发动机号</p>
                    </div>
                    <input class="value" type="text" placeholder="请输入发动机号" v-model="carinfo.engineNumber" />
                </div>
                <div class="user-set user-setting-carMileage" v-if="title === '修改里程'">
                    <div class="title">
                        <p class="text">当前里程</p>
                    </div>
                    <input class="value" type="text" placeholder="请输入当前里程" v-model="lastMileage" />
                </div>
                <div class="btnSubmit" @click="submitSetting">提交</div>
            </div>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
import { XHeader } from 'vux';

export default {
    props: {
        title: {
            type: String,
            default: null
        },
        data: {
            type: Object,
            default: null
        }
    },
    methods: {
        show() {
            this.initData();
            this.showFlag = true;
        },
        back() {
            this.showFlag = false;
        },
        submitSetting() {
            let carInfoParams = {};
            carInfoParams.frameNumber = this.carinfo.frameNumber;
            carInfoParams.engineNumber = this.carinfo.engineNumber;
            carInfoParams.lastMileage = this.carinfo.lastMileage = parseInt(this.lastMileage);
            this.$emit('change', carInfoParams, true);
        },
        initData() {
            if (this.data.lastMileage) {
                this.lastMileage = this.data.lastMileage.toString();
            }
            console.log(this.lastMileage);
            this.carinfo = JSON.parse(JSON.stringify(this.data));
        }
    },
    data() {
        return {
            showFlag: false,
            // 车架号
            carinfo: null,
            // 公里数
            lastMileage: ''
        };
    },
    watch: {
        data(value) {
            this.initData();
        },
        lastMileage(value) {
            this.lastMileage = value.replace(/[^0-9]/g, '');
        }
    },
    components: {
        XHeader
    }
};
</script>

<style scoped lang="stylus">
.user-revise-carinfo-submit
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
                flex: 0 0 80px
                width: 80px
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
