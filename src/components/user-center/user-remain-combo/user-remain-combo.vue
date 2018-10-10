<template>
    <transition name="slide">
        <div class="user-remain-combo">
            <x-header :left-options="{backText: ''}">剩余套餐</x-header>
            <scroll class="remain-combo-list" ref="scrollcombo"
                :data="comboList"
                :pullup="pullup"
                :pulldown="pulldown"
                @pulldown="refresh"
                @pullup="getMoreCombo">
                <div class="remain-combo-item" :class="{'expiry': combo.expiry}" v-for="(combo, index) in comboList" :key="index">
                    <div class="title">
                        {{ combo.counterCardName }}
                    </div>
                    <div class="content">
                        <div class="server" v-for="server in combo.counterCardItemList" :key="server.serveId">
                            <div class="server-name ellipsis">{{ server.counterCardItemName }}</div>
                            <div class="server-count">
                                （剩余<span class="count">{{ server.usableQuantity === '-1' ? '不限' : server.usableQuantity}}</span>次）
                            </div>
                        </div>
                    </div>
                    <div class="end-time">有效期:{{ combo.dateless ? '永久有效' : combo.expiryDate }}</div>
                </div>
            </scroll>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
import { XHeader } from 'vux';
import { getRemainComboList } from '@/api/usercenter';
import { routerMixin } from '@/common/js/mixin';
import Scroll from '@/components/base/scroll/scroll';

const PAGE_SIZE = 8;

export default {
    mixins: [routerMixin],
    methods: {
        async getMoreCombo() {
            if (!this.loadMore) {
                this.$refs.scrollcombo.forceUpdate(true);
                return;
            }
            this.pageNum++;
            let comboListResult = await getRemainComboList(PAGE_SIZE, this.pageNum);
            this.comboList = this.comboList.concat(comboListResult.content);
            setTimeout(() => {
                this.checkMore(comboListResult);
            }, 1000);
        },
        refresh() {
            this.pageNum = 0;
            setTimeout(() => {
                this.initData();
            }, 1000);
        },
        async initData() {
            let comboListResult = await getRemainComboList(PAGE_SIZE, this.pageNum);
            if (!comboListResult) {
                return;
            }
            this.comboList = comboListResult.content;
            this.checkMore(comboListResult);
        },
        checkMore(data) {
            this.loadMore = !data.isLast;
            this.$refs.scrollcombo.forceUpdate(data.isLast);
        }
    },
    data () {
        return {
            comboList: [],
            pageNum: 0,
            pullup: {
                threshold: 50,
                stop: 40
            },
            pulldown: {
                threshold: 50,
                stop: 40
            }
        };
    },
    components: {
        XHeader,
        Scroll
    }
};
</script>

<style scoped lang="stylus">
.user-remain-combo
    width: 100%
    position: fixed
    top: 0
    left: 0
    bottom: 0
    background: #fff
    z-index: 99
    .remain-combo-list
        width: 100%
        position: absolute
        top: 46px
        bottom: 0
        left: 0
        overflow: hidden
        box-sizing: border-box
        padding: 0 8px
        .remain-combo-item
            width: 100%
            height: auto
            overflow: hidden
            border-radius: 5px 5px 10px 10px
            margin: 16px 0
            border: 1px solid #E4E4E4
            background: url(./img/bg_content@2x.png) no-repeat right 10px center
            background-size: 80px 70px
            position: relative
            .title
                color: #fff
                width: 100%
                height: 34px
                line-height: 34px
                text-align: center
                background: url(./img/bg@2x.png) no-repeat center center
                background-size: 100% 100%
            .content
                width: 100%
                height: auto
                overflow: hidden
                padding: 20px 0
                .server
                    width: 100%
                    height: auto
                    overflow: hidden
                    display: flex
                    box-sizing: border-box
                    padding: 0 10px
                    .server-name
                        flex: 1
                    .server-count
                        flex: 0 0 120px
                        width: 120px
                        .count
                            padding: 0 6px
                            color: #fe3f51
            .end-time
                width: 100%
                height: 22px
                line-height: 22px
                padding-left: 34px
                box-sizing: border-box
                background: #f7f8fc url(./img/icon_time.png) no-repeat left 10px center
                background-size: 14px 14px
                color: #969897
            .icon_expiry
                position: absolute
                width: 70px
                top: 0px
                right: 0px
        .expiry
            .title
                background: url(./img/bg_expiry@2x.png) no-repeat center center
                background-size: 100% 100%
            .content
                .server
                    .server-count
                        .count
                            color: #9d9d9d
.slide-enter, .slide-leave-to
	transform: translate3d(100%, 0, 0)
.slide-enter-active, .slide-leave-active
	transition: all 0.3s
</style>
