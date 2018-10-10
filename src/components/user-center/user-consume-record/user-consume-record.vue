<template>
    <transition name="slide">
        <div class="user-consume-record">
            <x-header :left-options="{backText: ''}">消费记录</x-header>
            <scroll class="consume-record-content"  ref="scrollconsume"
                :data="consumeList"
                :pullup="pullup"
                :pulldown="pulldown"
                @pulldown="refresh"
                @pullup="getMoreConsume">
                <div class="consume-record-item"
                     v-for='item in consumeList' :key="item.id" v-if="item.businessScene !== 'REPAYMENT'">
                    <div class="consume-record-money">
                        <div class="title">消费金额</div>
                        <div class="text ellipsis">{{ item.settlementAmount.paid | consumeTotalAmount}}</div>
                    </div>
                    <div class="consume-record-info">
                        <div class="consume-record-msg" v-if="item.businessScene === 'WORK_ORDER'">
                            <div class="title">车牌号码</div>
                            <div class="text ellipsis">{{ item.licensePlate }}</div>
                        </div>
                        <div class="consume-record-msg">
                            <div class="title">消费项目</div>
                            <div class="text ellipsis">{{ item.summary }}</div>
                        </div>
                        <div class="consume-record-msg">
                            <div class="title">创建时间</div>
                            <div class="text ellipsis">{{ item.businessOption.settlementDate }}</div>
                        </div>
                    </div>
                    <!-- <div class="consumu-record-comment"  v-if="item.consumeType === 'WORK_ORDER'" @click="toComment(item)">
                        {{ item.isComment | isComment }}
                    </div> -->
                </div>
            </scroll>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
import { XHeader } from 'vux';
import Scroll from '@/components/base/scroll/scroll';
import { getConsumeRecord } from '@/api/usercenter';
import { routerMixin } from '@/common/js/mixin';

const PAGE_SIZE = 8;

export default {
    mixins: [routerMixin],
    methods: {
        refresh() {
            this.pageNum = 0;
            setTimeout(() => {
                this.initData();
            }, 1000);
        },
        checkMore(data) {
            this.loadMore = !data.isLast;
            this.$refs.scrollconsume.forceUpdate(data.isLast);
        },
        getMoreConsume() {
            if (!this.loadMore) {
                this.$refs.scrollconsume.forceUpdate(true);
                return;
            }
            this.pageNum++;
            setTimeout(async () => {
                let consumeResult = await getConsumeRecord(PAGE_SIZE, this.pageNum);
                this.consumeList = this.consumeList.concat(consumeResult.content);
                this.checkMore(consumeResult);
            }, 1000);
        },
        async initData() {
            let consumeResult = await getConsumeRecord(PAGE_SIZE, this.pageNum);
            if (!consumeResult) {
                return;
            }
            this.consumeList = consumeResult.content;
            this.checkMore(consumeResult);
        }
    },
    data() {
        return {
            pageNum: 0,
            consumeList: [],
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
    },
    filters: {
        consumeTotalAmount(amount) {
            let amountResult = amount === null ? '-' : '￥' + amount;
            return amountResult;
        },
        isComment(comment) {
            comment = comment ? '已评价' : '服务评价';
            return comment;
        }
    }
};
</script>

<style scoped lang="stylus">
.user-consume-record
    width: 100%
    position: fixed
    top: 0
    bottom: 0
    left: 0
    background: #fff
    z-index: 99
    .consume-record-content
        width: 100%
        position: absolute
        top: 46px
        bottom: 0
        left: 0
        overflow: hidden
        box-sizing: border-box
        padding: 0 10px
        .consume-record-item
            width: 100%
            height: auto
            overflow: hidden
            margin: 10px 0
            box-sizing: border-box
            padding: 0 10px
            border: 1px solid #dcdcdc
            border-radius: 40px 0 0 0
            .consume-record-money
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
            .consume-record-info
                border-top: 1px solid #e4e4e4
                .consume-record-msg
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
            .consumu-record-comment
                width: 100%
                height: 40px
                line-height: 40px
                text-align: center
                color: #fff
                background: #fe3f51
                margin-bottom: 10px
                font-size: 16px
                border-radius: 20px
                display: block
.slide-enter, .slide-leave-to
	transform: translate3d(100%, 0, 0)
.slide-enter-active, .slide-leave-active
	transition: all 0.3s
</style>
