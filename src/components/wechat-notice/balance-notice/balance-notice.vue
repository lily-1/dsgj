<template>
    <div class="balance-notice">
        <scroll :data="balanceInfo.items" v-if="type === 'RECEIPT'">
            <div class="balance-info">
                <x-header :left-options="{backText: '',preventGoBack: true,showBack: false}">工单结算</x-header>
                <!--结算当前用户信息-->
                <div class="user-info">
                    <div class="user-licenses">
                        <div class="icon-workorder"></div>
                        <div class="licenseplates">{{ balanceInfo.licensePlate | licensePlate }}</div>
                    </div>
                    <div class="user-contact" v-if="balanceInfo.consumeCustomer && balanceInfo.consumeCustomer.contactName && balanceInfo.consumeCustomer.contactTelephone">
                        <p>
                            {{ balanceInfo.consumeCustomer.contactName }}(<span style="color: #1aabff;">{{ balanceInfo.consumeCustomer.contactTelephone }}</span>)<span class="icon-wechat"></span>
                        </p>
                    </div>
                    <div class="user-company" v-if="balanceInfo.consumeCustomer && balanceInfo.consumeCustomer.category !== 'PERSONAGE'">{{ balanceInfo.consumeCustomer.name }}</div>
                </div>
                <!--如果是工单就展示工单信息-->
                <div class="work-order-info" v-if="workorder">
                    <div class="title">购买信息</div>
                    <div class="info-content">
                        <div class="tab">
                            <div class="item">项目商品</div>
                            <div class="item">数量</div>
                            <div class="item">总售价</div>
                        </div>
                        <div class="info">
                            <div class="tab" v-for="item in workorder.items" :key="item.id">
                                <div class="item">{{ item.name }}</div>
                                <div class="item">{{ item.quantity }}</div>
                                <div class="item">￥{{ item.retailPrice }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <!--充值信息-->
                <div class="recharge-info" v-if="rechargeInfo">
                    <div class="title">充值金额</div>
                    <div class="info-content">
                        <div class="info-item">
                            <div class="info-label">充值金额</div>
                            <div class="info-value">￥{{ rechargeInfo.rechargeAmount }}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">赠送金额</div>
                            <div class="info-value">￥{{ rechargeInfo.giftAmount }}</div>
                        </div>
                    </div>
                </div>
                <!--套餐信息-->
                <div class="package-info" v-if="packageList.length > 0">
                    <div class="title">套餐信息</div>
                    <div class="package-info-content" v-for="packageItem in packageList" :key="packageItem.counterCardId">
                        <div class="package-name">{{ packageItem.counterCardName }}</div>
                        <div class="package-item" v-for="serverItem in packageItem.counterCardItemList" :key="serverItem.counterCardItemId">
                            <div class="item item-name">{{ serverItem.counterCardItemName }}</div>
                            <div class="item item-count">{{ serverItem.usableQuantity === '-1' ? '不限' : serverItem.usableQuantity }}</div>
                            <div class="item item-price">￥{{ serverItem.retailPrice }}</div>
                        </div>
                        <div class="package-time">
                            <div class="time">有效期:{{ packageItem.dateless ? '永久有效' : packageItem.expiryDate }}</div>
                            <div class="amount">￥80.00</div>
                        </div>
                    </div>
                </div>
                <!--结算信息-->
                <div class="balance-info" v-if="balanceInfo.settlementAmount">
                    <div class="title">结算信息</div>
                    <div class="info-content">
                        <div class="info-item">
                            <div class="info-label">消费金额</div>
                            <div class="info-value">￥{{ balanceInfo.settlementAmount.payable }}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">减免金额</div>
                            <div class="info-value">-￥{{ balanceInfo.settlementAmount.deduct }}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">实付金额</div>
                            <div class="info-value">￥{{ balanceInfo.settlementAmount.paid }}</div>
                        </div>
                    </div>
                </div>
                <!--支付信息-->
                <div class="pay-info"  v-if="balanceInfo.settlementAmount">
                    <div class="title">支付信息</div>
                    <div class="info-content">
                        <div class="info-item" v-if="balanceInfo.settlementAmount.alipay > 0">
                            <div class="info-label">支付宝支付</div>
                            <div class="info-value">￥{{ balanceInfo.settlementAmount.alipay }}</div>
                        </div>
                        <div class="info-item" v-if="balanceInfo.settlementAmount.balance > 0">
                            <div class="info-label">余额支付</div>
                            <div class="info-value">￥{{ balanceInfo.settlementAmount.balance }}</div>
                        </div>
                        <div class="info-item" v-if="balanceInfo.settlementAmount.bankCard > 0">
                            <div class="info-label">银行卡支付</div>
                            <div class="info-value">￥{{ balanceInfo.settlementAmount.bankCard }}</div>
                        </div>
                        <div class="info-item" v-if="balanceInfo.settlementAmount.cash > 0">
                            <div class="info-label">现金支付</div>
                            <div class="info-value">￥{{ balanceInfo.settlementAmount.cash }}</div>
                        </div>
                        <div class="info-item" v-if="balanceInfo.settlementAmount.credit > 0">
                            <div class="info-label">信用卡支付</div>
                            <div class="info-value">￥{{ balanceInfo.settlementAmount.credit }}</div>
                        </div>
                        <div class="info-item" v-if="balanceInfo.settlementAmount.weixinpay > 0">
                            <div class="info-label">微信支付</div>
                            <div class="info-value">￥{{ balanceInfo.settlementAmount.weixinpay }}</div>
                        </div>
                        <div class="info-item" v-if="balanceInfo.settlementAmount.other > 0">
                            <div class="info-label">其他支付</div>
                            <div class="info-value">￥{{ balanceInfo.settlementAmount.other }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </scroll>
        <!--还款结算单据-->
        <scroll v-if="type === 'REPAYMENT'">
            <div class="repayment-info">
                <x-header :left-options="{backText: '',preventGoBack: true,showBack: false}">还款单据结算详情</x-header>
                <!--结算当前用户信息-->
                <div class="user-info">
                    <div class="user-licenses">
                        <div class="icon-workorder"></div>
                        <div class="licenseplates">{{ repaymentInfo.licensePlate | licensePlate }}</div>
                    </div>
                    <div class="user-contact" v-if="repaymentInfo.consumeCustomer && repaymentInfo.consumeCustomer.contactName && repaymentInfo.consumeCustomer.contactTelephone">
                        <p>
                            {{ repaymentInfo.consumeCustomer.contactName }}(<span style="color: #1aabff;">{{ repaymentInfo.consumeCustomer.contactTelephone }}</span>)<span class="icon-wechat"></span>
                        </p>
                    </div>
                    <div class="user-company" v-if="repaymentInfo.consumeCustomer && repaymentInfo.consumeCustomer.category !== 'PERSONAGE'">{{ repaymentInfo.consumeCustomer.name }}</div>
                </div>
                <!--还款信息-->
                <div class="repayment-content" v-if="repaymentInfo.items && repaymentInfo.items.length > 0">
                    <div class="title">还款单据</div>
                    <div class="info-content">
                        <div class="info-item" v-for="repayment in repaymentInfo.items" :key="repayment.id">
                            <div class="info info-label">{{ repayment.customerReceiptVoucher.businessScene | businessScene }}</div>
                            <div class="info info-time">{{ repayment.customerReceiptVoucher.createDateTime }}</div>
                            <div class="info info-price">￥{{ repayment.customerReceiptVoucher.initialPaidAmount }}</div>
                        </div>
                    </div>
                </div>
                <!--结算信息-->
                <div class="balance-info" v-if="repaymentInfo.settlementAmount">
                    <div class="title">结算信息</div>
                    <div class="info-content">
                        <div class="info-item">
                            <div class="info-label">挂账金额</div>
                            <div class="info-value">￥{{ repaymentInfo.settlementAmount.payable }}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">减免金额</div>
                            <div class="info-value">-￥{{ repaymentInfo.settlementAmount.deduct }}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">实付金额</div>
                            <div class="info-value">￥{{ repaymentInfo.settlementAmount.paid }}</div>
                        </div>
                    </div>
                </div>
                <!--支付信息-->
                <div class="pay-info"  v-if="repaymentInfo.settlementAmount">
                    <div class="title">支付信息</div>
                    <div class="info-content">
                        <div class="info-item" v-if="repaymentInfo.settlementAmount.alipay > 0">
                            <div class="info-label">支付宝支付</div>
                            <div class="info-value">￥{{ repaymentInfo.settlementAmount.alipay }}</div>
                        </div>
                        <div class="info-item" v-if="repaymentInfo.settlementAmount.balance > 0">
                            <div class="info-label">余额支付</div>
                            <div class="info-value">￥{{ repaymentInfo.settlementAmount.balance }}</div>
                        </div>
                        <div class="info-item" v-if="repaymentInfo.settlementAmount.bankCard > 0">
                            <div class="info-label">银行卡支付</div>
                            <div class="info-value">￥{{ repaymentInfo.settlementAmount.bankCard }}</div>
                        </div>
                        <div class="info-item" v-if="repaymentInfo.settlementAmount.cash > 0">
                            <div class="info-label">现金支付</div>
                            <div class="info-value">￥{{ repaymentInfo.settlementAmount.cash }}</div>
                        </div>
                        <div class="info-item" v-if="repaymentInfo.settlementAmount.credit > 0">
                            <div class="info-label">信用卡支付</div>
                            <div class="info-value">￥{{ repaymentInfo.settlementAmount.credit }}</div>
                        </div>
                        <div class="info-item" v-if="repaymentInfo.settlementAmount.weixinpay > 0">
                            <div class="info-label">微信支付</div>
                            <div class="info-value">￥{{ repaymentInfo.settlementAmount.weixinpay }}</div>
                        </div>
                        <div class="info-item" v-if="repaymentInfo.settlementAmount.other > 0">
                            <div class="info-label">其他支付</div>
                            <div class="info-value">￥{{ repaymentInfo.settlementAmount.other }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </scroll>
    </div>
</template>

<script type="text/ecmascript-6">
import Scroll from '@/components/base/scroll/scroll';
import { XHeader } from 'vux';
import { getBalanceInfo, getWorkOrder, getPackagePlan, getRepaymentInfo } from '@/api/notice';

export default {
    methods: {
        async getRepayment(id) {
            let repaymentResult = await getRepaymentInfo(id);
            console.log(repaymentResult);
            this.repaymentInfo = repaymentResult;
        },
        async getReceipt(id) {
            let balanceInfoResult = await getBalanceInfo(id);
            this.balanceInfo = balanceInfoResult;
            /**
             * 判断场景
             * 1.businessScene为WORK_ORDER是工单
             * 2.businessScene为QUICK_RECEIPT是快捷收款
             * 3.businessScene为套餐充值
            */
            if (balanceInfoResult.businessScene === 'WORK_ORDER') {
                let id = balanceInfoResult.items[0].businessId;
                let workOrderResult = await getWorkOrder(id);
                this.workorder = workOrderResult;
            } else {
                if (balanceInfoResult.businessScene === 'QUICK_RECEIPT') {
                    return;
                }
                this.balanceInfo.items.forEach(async (item) => {
                    if (item.itemType === 'PACKAGE_PLAN') {
                        let packagePlanResult = await getPackagePlan(item.businessId);
                        this.packageList.push(packagePlanResult);
                    } else if (item.itemType === 'RECHARGE') {
                        let obj = {};
                        obj.rechargeAmount = item.rechargeAmount;
                        obj.giftAmount = item.giftAmount;
                        this.rechargeInfo = obj;
                    }
                });
            }
        }
    },
    created() {
        let voucherId = this.$route.query.id;
        let type = this.type = this.$route.query.type;
        if (type === 'RECEIPT') {
            this.getReceipt(voucherId);
        } else {
            this.getRepayment(voucherId);
        }
    },
    filters: {
        licensePlate(val) {
            if (!val) {
                return '客户暂无车牌';
            }
            return val;
        },
        businessScene(val) {
            let str = '';
            switch (val) {
                case 'WORK_ORDER':
                    str = '工单还款';
                    break;
                case 'OPEN_CARD':
                    str = '开卡还款';
                    break;
                case 'CONTINUED_CARD':
                    str = '续卡还款';
                    break;
                case 'RECHARGE':
                    str = '充值还款';
                    break;
                case 'BUY_PACKAGE_PLAN':
                    str = '套餐还款';
                    break;
                case 'QUICK_RECEIPT':
                    str = '快捷收款还款';
                    break;
                default:
                    break;
            };
            console.log(str);
            return str;
        }
    },
    data() {
        return {
            type: '',
            balanceInfo: {},
            packageList: [],
            rechargeInfo: null,
            workorder: null,
            repaymentInfo: {}
        };
    },
    components: {
        Scroll,
        XHeader
    }
};
</script>

<style scoped lang="stylus">
.balance-notice
    width: 100%
    position: absolute
    top: 0
    bottom: 0
    left: 0
    background: #f1f1f1
    z-index: 999
    .repayment-info
        .repayment-content
            margin-bottom: 16px
            .title
                margin-bottom: 4px
            .info-content
                width: 100%
                box-sizing: border-box
                padding: 0 16px
                background: #fff
                .info-item
                    width: 100%
                    display: flex
                    line-height: 36px
                    .info
                        flex: 1
                        text-align: center
                    .info-label
                        flex: 0 0 80px
                        width: 80px
                        text-align: left
                    .info-time
                        flex: 2
                    .info-price
                        text-align: right
    .title
        width: 100%
        height: 24px
        box-sizing: border-box
        padding-left: 16px
        line-height: 24px
    .balance-info, .repayment-info
        width: 100%
        height: auto
        overflow: hidden
        /*============结算当前用户信息=============*/
        .user-info
            width: 100%
            height: auto
            overflow: hidden
            box-sizing: border-box
            padding: 8px
            background: #fff
            margin-bottom: 6px
            .user-licenses
                width: 100%
                height: 36px
                line-height: 36px
                display: flex
                .icon-workorder
                    flex: 0 0 24px
                    width: 24px
                    height: 100%
                    background: url('./img/icon-workorder@2x.png') no-repeat center left
                    background-size: 16px 16px
                .licenseplates
                    flex: 1
                    font-weight: 600
            .user-contact
                width: 100%
                height: auto
                overflow: hidden
                p
                    display: flex
                    align-items: center
                .icon-wechat
                    margin-left: 4px
                    display: inline-block
                    width: 16px
                    height: 16px
                    background: url('./img/icon-wechat@2x.png') no-repeat center center
                    background-size: 16px 16px
        /*============工单信息=============*/
        .work-order-info
            width: 100%
            height: auto
            overflow: hidden
            margin-bottom: 16px
            .info-content
                width: 100%
                height: auto
                overflow: hidden
                box-sizing: border-box
                padding: 0 6px
                background: #fff
                .tab
                    width: 100%
                    height: 36px
                    line-height: 36px
                    display: flex
                    border-bottom: 1px solid #d9d9d9
                    &:last-child
                        border: 0
                    .item
                        flex: 1
                        text-align: center
                        text-overflow: ellipsis
                        white-space: nowrap
                        overflow: hidden
                        box-sizing: border-box
                    .item:nth-child(1)
                        text-align: left
                        padding-left: 6px
                    .item:nth-child(2)
                        flex: 0 0 80px
                        width: 80px
                    .item:nth-child(3)
                        text-align: right
                        padding-right: 12px
                .info
                    .tab
                        height: 28px
                        line-height: 28px
                        color: #999
                        .item:nth-child(3)
                            padding-right: 16px
        /*============套餐信息=============*/
        .package-info
            width: 100%
            height: auto
            overflow: hidden
            margin-bottom: 12px
            .package-info-content
                width: 100%
                height: auto
                overflow: hidden
                box-sizing: border-box
                padding: 0 16px
                background: #fff
                .package-item
                    width: 100%
                    display: flex
                    .item
                        flex: 1
                        line-height: 26px
                        text-align: center
                        text-overflow: ellipsis
                        white-space: nowrap
                        overflow: hidden
                    .item-name
                        text-align: left
                    .item-price
                        text-align: right
                .package-name
                    width: 100%
                    height: 36px
                    line-height: 36px
                    border-bottom: 1px solid #d9d9d9
                .package-time
                    width: 100%
                    height: 28px
                    line-height: 28px
                    border-top: 1px solid #d9d9d9
                    display: flex
                    .time
                        width: 160px
                        flex: 0 0 160px
                    .amount
                        flex: 1
                        text-align: right
        /*============结算信息,充值金额=============*/
        .balance-info, .pay-info,.recharge-info
            width: 100%
            height: auto
            overflow: hidden
            margin-bottom: 12px
            .info-content
                height: auto
                overflow: hidden
                width: 100%
                background: #fff
                .info-item
                    width: 100%
                    display: flex
                    box-sizing: border-box
                    padding: 0 16px
                    line-height: 32px
                    .info-label
                        width: 80px
                        flex: 0 0 80px
                        color: #c5c5c5
                    .info-value
                        flex: 1
                        text-align: right
</style>
