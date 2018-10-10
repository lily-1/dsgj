<template>
    <transition name="slide">
        <div class="user-subscribe-record">
            <x-header :left-options="{backText: ''}">预约记录</x-header>
            <scroll class="subscribe-record-content"  ref="scrollsubscribe"
                :data="subscribeList"
                :pullup="pullup"
                :pulldown="pulldown"
                @pulldown="refresh"
                @pullup="getMoreSubscribe">
                <div class="subscribe-record-item"
                     v-for='(item, index) in subscribeList' :key="index">
                    <div class="subscribe-record-servername">
                        <div class="title">预约项目</div>
                        <div class="text ellipsis">{{ item.servicesName }}</div>
                    </div>
                    <div class="subscribe-record-info">
                        <div class="subscribe-record-msg">
                            <div class="title">服务门店</div>
                            <div class="text ellipsis">{{ item.storeName }}</div>
                            <a class="icon-tel" :href="'tel:' + item.storeTel"></a>
                        </div>
                        <div class="subscribe-record-msg">
                            <div class="title">车牌号码</div>
                            <div class="text ellipsis">{{ item.licensePlate }}</div>
                        </div>
                        <div class="subscribe-record-msg">
                            <div class="title">预约时间</div>
                            <div class="text ellipsis">{{ item.appointmentTime }}</div>
                        </div>
                    </div>
                    <div class="subscribe-record-memo">
                        <div class="title">
                            <img class="icon" src="./img/icon_remark@2x.png" />
                            <p>备注:</p>
                        </div>
                        <div class="text ellipsis">{{ item.remark }}</div>
                    </div>
                </div>
            </scroll>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
import { XHeader } from 'vux';
import { getUserAppointmentRecord } from '@/api/usercenter';
import { routerMixin } from '@/common/js/mixin';
import Scroll from '@/components/base/scroll/scroll';

const PAGE_SIZE = 8;

export default {
    mixins: [routerMixin],
    methods: {
        getMoreSubscribe() {
            if (!this.loadMore) {
                this.$refs.scrollsubscribe.forceUpdate(true);
                return;
            }
            this.pageNum++;
            setTimeout(async () => {
                let subscribeResult = await getUserAppointmentRecord(this.storeId, this.pageNum, PAGE_SIZE);
                this.subscribeList = this.subscribeList.concat(subscribeResult.content);
                this.checkMore(subscribeResult);
            }, 1000);
        },
        refresh() {
            this.pageNum = 0;
            setTimeout(() => {
                this.initData();
            }, 1000);
        },
        async initData() {
            let subscribeResult = await getUserAppointmentRecord(this.pageNum, PAGE_SIZE);
            if (!subscribeResult) {
                return;
            }
            this.subscribeList = subscribeResult.content;
            this.checkMore(subscribeResult);
        },
        checkMore(data) {
            this.loadMore = !data.isLast;
            this.$refs.scrollsubscribe.forceUpdate(data.isLast);
        }
    },
    data() {
        return {
            pageNum: 0,
            subscribeList: [],
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
.user-subscribe-record
    width: 100%
    position: fixed
    top: 0
    bottom: 0
    left: 0
    background: #fff
    z-index: 99
    .subscribe-record-content
        width: 100%
        position: absolute
        top: 46px
        bottom: 0
        left: 0
        overflow: hidden
        box-sizing: border-box
        padding: 0 10px
        .subscribe-record-item
            width: 100%
            height: auto
            overflow: hidden
            margin: 10px 0
            border: 1px solid #dcdcdc
            border-radius: 40px 0 30px 0
            box-sizing: border-box
            .subscribe-record-servername
                padding: 10px 10px 10px 20px
                line-height: 26px
                height: 26px
                display: flex
                .title
                    flex: 0 0 80px
                    width: 80px
                    color: #333
                .text
                    flex: 1
                    color: #fe3f51
            .subscribe-record-info
                border-top: 1px solid #e4e4e4
                .subscribe-record-msg
                    display: flex
                    line-height: 40px
                    padding: 0px 0px 0px 20px
                    font-size: 14px
                    border-bottom: 1px solid #f7f8fc
                    color: #666
                    .title
                        flex: 0 0 80px
                        width: 80px
                    .text
                        flex: 1
                    .icon-tel
                        flex: 0 0 40px
                        width: 40px
                        height: 40px
                        background: url(./img/icon_tel@2x.png) no-repeat center center
                        background-size: 30px 30px
            .subscribe-record-memo
                display: flex
                padding: 10px 10px 10px 20px
                font-size: 16px
                background: #f7f8fc
                color: #97989a
                .title
                    flex: 0 0 66px
                    width: 66px
                    display: flex
                    .icon
                        flex: 0 0 15px
                        width: 15px
                        height: 16px
                    p
                        flex: 1
                        font-size: 14px
                        line-height: 16px
                        box-sizing: border-box
                        padding-left: 10px
.slide-enter, .slide-leave-to
	transform: translate3d(100%, 0, 0)
.slide-enter-active, .slide-leave-active
	transition: all 0.3s
</style>
