<template>
    <div class="order-item">
        <div class="order-title">
            <div class="title ellipsis">{{ storeName }}</div>
            <div class="status">{{ data.status | orderstatus }}</div>
        </div>
        <div class="order-content">
            <div class="good-avatar">
                <img class="avatar" v-lazy="picurl + data.goodsCoverPicturePath" />
            </div>
            <div class="good-info">
                <div class="good-name">{{ data.goodsName }}</div>
                <div class="good-sku">{{ data.goodsSKULabel }}</div>
                <div class="good-price">
                    <div class="good-sellprice">￥{{ data.unitPrice }}</div>
                    <div class="good-num">x{{ data.quantity }}</div>
                </div>
            </div>
        </div>
        <div class="order-operation">
            <div class="order-pay-price">实付款: ￥{{ data.paymentAmount }}</div>
            <div class="order-button-box">
                <m-button v-if="data.status === 'UNPAID'" ref="cancelBtn" class="button order-button-cancel" @clickBtn="cancel">取消订单</m-button>
                <m-button v-if="data.status === 'UNPAID'" ref="payBtn" class="button order-button-pay" @clickBtn="paid">付款</m-button>
                <m-button v-if="data.status === 'SENT'" ref="recivedBtn" class="button order-button-recive" @clickBtn="recived">确认收货</m-button>
                <div v-if="data.status === 'COMPLETED'" class="button order-button-comment" @click="toComment">去评价</div>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import MButton from '@/components/base/m-button/m-button';
import { mapGetters } from 'vuex';
import { PICURL } from '@/common/js/config';

export default {
    methods: {
        cancel() {
            this.$emit('cancel');
        },
        paid() {
            this.$emit('paid');
        },
        recived() {
            this.$emit('recived');
        },
        toComment() {
            this.$emit('comment');
        }
    },
    props: {
        data: {
            type: Object,
            default: null
        }
    },
    filters: {
        orderstatus(status) {
            let statusResult = '';
            switch (status) {
                case 'PAID':
                    statusResult = '待发货';
                    break;
                case 'UNPAID':
                    statusResult = '待支付';
                    break;
                case 'COMPLETED':
                    statusResult = '交易完成';
                    break;
                case 'COMMENT':
                    statusResult = '已评价';
                    break;
                case 'CANCELED':
                    statusResult = '已取消';
                    break;
                case 'SENT':
                    statusResult = '待收货';
                    break;
                default:
                    break;
            }
            return statusResult;
        }
    },
    data() {
        return {
            picurl: PICURL
        };
    },
    computed: {
        ...mapGetters([
            'storeName'
        ])
    },
    components: {
        MButton
    }
};
</script>

<style scoped lang="stylus">
.order-item
    width: 100%
    height: 180px
    margin-bottom: 14px
    background: #fff
    .order-title
        width: 100%
        height: 36px
        line-height: 36px
        box-sizing: border-box
        border-bottom: 1px solid #e9e9e9
        display: flex
        .title
            flex: 1
            height: 100%
            box-sizing: border-box
            padding-left: 16px
            background: url(./img/icon_title@2x.png) no-repeat left 6px center
            background-size: 3px 16px
            color: #333
        .status
            flex: 0 0 70px
            width: 70px
            height: 100%
            text-align: center
            color: #b1b1b1
    .order-content
        width: 100%
        height: 108px
        box-sizing: border-box
        padding: 8px
        display: flex
        border-bottom: 1px solid #e9e9e9
        .good-avatar
            flex: 0 0 92px
            width: 92px
            height: 92px
            .avatar
                width: 100%
                height: 100%
                display: inline-block
        .good-info
            flex: 1
            height: 100%
            box-sizing: border-box
            padding-left: 12px
            .good-name
                width: 100%
                height: 36px
                display: -webkit-box
                -webkit-box-orient: vertical
                -webkit-line-clamp: 2
                overflow: hidden
                line-height: 18px
                margin-bottom: 10px
            .good-sku
                width: 100%
                height: 24px
                color: #999
            .good-price
                height: 22px
                line-height: 22px
                width: 100%
                display: flex
                .good-sellprice
                    flex: 1
                    color: #fc4450
                .good-num
                    flex: 1
                    color: #999
                    text-align: right
    .order-operation
        width: 100%
        height: 38px
        line-height: 38px
        display: flex
        .order-pay-price
            flex: 0 0 150px
            width: 150px
            box-sizing: border-box
            padding-left: 8px
        .order-button-box
            flex: 1
            box-sizing: border-box
            height: 100%
            display: flex
            justify-content: flex-end
            align-items: center
            .button
                width: 70px
                height: 24px
                line-height: 24px
                border: 1px solid #dcdcdc
                border-radius: 16px
                margin: 0 6px
                text-align: center
                color: #999999
            .order-button-pay, .order-button-comment, .order-button-recive
                border-color: #fc4450
                color: #fc4450
</style>
