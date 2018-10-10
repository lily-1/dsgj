<template>
    <transition name="slide">
        <div class="user-setting">
            <x-header :left-options="{backText: ''}">个人资料</x-header>
            <div class="user-info-content">
                <div class="user-info" @click="toSetting('修改姓名')">
                    <div class="title">姓名</div>
                    <div class="value ellipsis">{{ userInfo.name }}</div>
                </div>
                <div class="user-info user-phone" @click="toSetting('修改手机号')">
                    <div class="title">手机号</div>
                    <div class="value ellipsis">{{ contactTelephone }}</div>
                </div>
                <div class="stand"></div>
                <div class="user-info" @click="showSexClick">
                    <div class="title">性别</div>
                    <div class="value ellipsis">{{ userInfo.gender | sex }}</div>
                </div>
                <div class="user-info">
                    <div class="title">生日</div>
                    <datetime class="value ellipsis"
                        :title="('show time')"
                        :confirm-text="('确定')"
                        :cancel-text="('取消')"
                        :end-date="endDate"
                        @on-change="change"
                        :min-year=1900>
							{{ userInfo.birthday }}
					</datetime>
                </div>
                <div class="user-info edit-address"  @click="toSetting('修改地址')">
                    <div class="title">地址</div>
                    <div class="value ellipsis">修改</div>
                </div>
            </div>
            <userSettingSubmit ref="userSetting"  v-show="showNext"
                :data="userInfo"
                :title="title"
                @change="changeInfo"
                @changePhone="changePhone"
                @back="backSetting">
            </userSettingSubmit>
            <actionsheet
                v-model="showSex"
                :menus="menuList"
                theme="android"
                @on-click-menu="clickAction">
            </actionsheet>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
import { XHeader, Actionsheet, Datetime } from 'vux';
import { getMemberInfo, getUserInfo, editUserInfo } from '@/api/usercenter';
import { errfun } from '@/common/js/util';
import { formatDate } from '@/common/js/date';
import { routerMixin } from '@/common/js/mixin';
import UserSettingSubmit from '@/components/user-center/user-setting/user-setting-submit/user-setting-submit';

export default {
    mixins: [routerMixin],
    methods: {
        changePhone(contactTelephone) {
            this.contactTelephone = contactTelephone || this.contactTelephone;
            this.showNext = false;
            this.$refs.userSetting.resetbtn();
        },
        async changeInfo(params) {
            // 必填项客户分类
            params.category = this.userInfo.category;
            // 必填项客户姓名(如果有修改就用修改名称,如果没修改就用原来的姓名)
            this.userInfo.name = params.name = params.name || this.userInfo.name;
            let editResult = await editUserInfo(params);
            if (!editResult.code) {
                this.showNext = false;
                this.$vux.toast.show({
                    text: '修改成功',
                    position: 'bottom',
                    type: 'text',
                    width: '9.2em'
                });
            } else {
                errfun(this, this.$router, editResult.code, editResult.message);
            }
            this.$refs.userSetting.resetbtn();
        },
        async initData() {
            // 设置当前时间
            let datetoday = new Date(); // 获取今天日期
            this.endDate = formatDate(datetoday, 'yyyy-MM-dd');
            // 获取客户信息
            let memberInfoResult = await getMemberInfo();
            this.contactTelephone = memberInfoResult.result.mobilePhone;
            // 获取用户信息
            let userInfoResult = await getUserInfo();
            if (!userInfoResult.code) {
                this.userInfo = userInfoResult.result;
            } else {
                errfun(this, this.$router, userInfoResult.code, userInfoResult.message);
            }
        },
        // 修改性别函数
        clickAction(value) {
            let params = {};
            let gender = '';
            if (value === 0) {
                gender = 'MALE';
            } else {
                gender = 'FEMALE';
            };
            this.userInfo.gender = params.gender = gender;
            this.changeInfo(params);
        },
        // 修改生日
        change(value) {
            let params = {};
            this.userInfo.birthday = params.birthday = value;
            this.changeInfo(params);
        },
        toSetting(title) {
            this.title = title;
            this.showNext = true;
        },
        backSetting() {
            this.showNext = false;
        },
        showSexClick() {
            this.showSex = true;
        }
    },
    filters: {
        sex(value) {
            if (!value) {
                return '';
            }
            let sexStr = value === 'MALE' ? '男' : '女';
            return sexStr;
        }
    },
    data() {
        return {
            contactTelephone: '',
            userInfo: {},
            title: '',
            showSex: false, // 性别选项卡
            showNext: false, // 下一层页面
            menuList: [ // 性别列表
                '男',
                '女'
            ],
            endDate: ''
        };
    },
    components: {
        XHeader,
        Actionsheet,
        Datetime,
        UserSettingSubmit
    }
};
</script>

<style scoped lang="stylus">
.user-setting
    width: 100%
    position: fixed
    top: 0
    bottom: 0
    left: 0
    background: #f0f1f3
    z-index: 99
    .user-info-content
        width: 100%
        height: auto
        overflow: hidden
        background: #fff
        .user-info
            width: 100%
            height: 50px
            line-height: 50px
            display: flex
            box-sizing: border-box
            padding: 0 10px
            .title, .value
                font-size: 14px
                color: #333
                border-bottom: 1px solid #e9e9e9
            .title
                flex: 0 0 64px
                width: 64px
            .value
                flex: 1
                box-sizing: border-box
                padding-right: 20px
                background: url(./img/icon_right@2x.png) no-repeat right 6px center
                background-size: auto 12px
                text-align: right
                justify-content: flex-end
        .edit-address
            .value
                color: #fe3f51
        .stand
            width: 100%
            height: 10px
            background: #f0f1f2
.slide-enter-active, .slide-leave-active
    transition: all 0.3s
.slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
