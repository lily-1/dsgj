<template>
    <transition name="slide">
        <div class="user-revise-carinfo">
            <x-header :left-options="{backText: ''}">完善车辆</x-header>
            <scroll class="carinfo-scroll-box">
                <div class="user-carno">
                    <div class="title">车牌号</div>
                    <div class="carno" v-if="carInfo">{{ carInfo.licensePlate }}</div>
                </div>
                <div class="user-carinfo-content">
                    <!--品牌车系-->
                    <div class="user-carinfo-item" @click="chioceCarBrand">
                        <div class="title">品牌车系</div>
                        <div class="value ellipsis" v-if="carInfo &&carInfo.brandSeries">{{ carInfo.brandSeries + carInfo.model }}</div>
                    </div>
                    <!--车型-->
                    <div class="user-carinfo-item" v-if="carInfo && carInfo.brandSeries && carInfo.model"  @click="chioceCarType">
                        <div class="title">车型</div>
                        <div class="value ellipsis">{{ carInfo.yearVersion }}</div>
                    </div>
                    <!--价格-->
                    <popup-picker class="user-carinfo-item"
                        :data="prices"
                        :title="'价格'"
                        v-model="price"
                        @on-change="onChangePrice">
                    </popup-picker>
                    <!--颜色-->
                    <popup-picker class="user-carinfo-item"
                        :data="colors"
                        :title="'车辆颜色'"
                        v-model="color"
                        @on-change="onChangeColor">
                    </popup-picker>
                    <!--车架号-->
                    <div class="user-carinfo-item" @click="toChange('修改车架号')">
                        <div class="title">车架号</div>
                        <div class="value" v-if="carInfo">{{ carInfo.frameNumber }}</div>
                    </div>
                    <!--发动机号-->
                    <div class="user-carinfo-item" @click="toChange('修改发动机号')">
                        <div class="title">发动机号</div>
                        <div class="value" v-if="carInfo">{{ carInfo.engineNumber }}</div>
                    </div>
                    <!--上牌时间-->
                    <datetime class="user-carinfo-item"
                        :title="('show time')"
                        :confirm-text="('确定')"
                        :cancel-text="('取消')"
                        :min-year=1900
                        :end-date="endDate"
                        @on-change="onChangeLicense">
                        <div class="title">上牌时间</div>
                        <div class="value" v-if="carInfo">{{ carInfo.licenseDate }}</div>
                    </datetime>
                    <!--当前里程-->
                    <div class="user-carinfo-item" @click="toChange('修改里程')">
                        <div class="title">当前里程</div>
                        <div class="value" v-if="carInfo">{{ carInfo.lastMileage | carMileage }}公里</div>
                    </div>
                    <!--保险日期-->
                    <datetime class="user-carinfo-item"
                        :title="('show time')"
                        :confirm-text="('确定')"
                        :cancel-text="('取消')"
                        :min-year=1900
                        @on-change="onChangeInsurance">
                        <div class="title">保险日期</div>
                        <div class="value" v-if="carInfo">{{ carInfo.insuranceDate }}</div>
                    </datetime>
                </div>
            </scroll>
            <modal ref="modalbrand"
                :title="true"
                :hasback="hasBack"
                @backpage="backpage">
                <listview ref="listview"
                    :data="carBrand"
                    @next="next">
                </listview>
                <transition name="slide">
                    <scroll class="car-series" :data="carSeries" ref="carseries" v-show="hasBack">
                        <ul>
                            <li class="car-series-item" v-for="item in carSeries"
                                @click.stop="selectCarSeries(item)"
                                :class="{'active': item.modelName === carInfo.model && carInfo.manufacturerCode === item.manufacturerCode}"
                                :key="item.seriesId">
                                <p class="ellipsis">{{ item.manufacturerName + item.modelName }}</p>
                            </li>
                        </ul>
                    </scroll>
                </transition>
            </modal>
            <modal ref="modalcartype" :title="true">
                <scroll class="car-type" :data="carType">
                    <div class="car-type-item ellipsis" v-for="item in carType"
                        @click.stop="selectCarType(item)"
                        :class="{'active': item.yearVersion === carInfo.yearVersion}"
                        :key="item.modelId">
                        {{ item.yearVersion }}
                    </div>
                </scroll>
            </modal>
            <userReviseCarinfoSubmmit ref="submitCarinfo"
                :title="subTitle"
                :data="carInfo"
                @change="changeCarInfo">
            </userReviseCarinfoSubmmit>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
import Scroll from '@/components/base/scroll/scroll';
import Modal from '@/components/base/modal/modal';
import listview from '@/components/base/listview/listview';
import UserReviseCarinfoSubmmit from '@/components/user-center/user-complete-carinfo/user-revise-carinfo-submit/user-revise-carinfo-submit';
import { XHeader, PopupPicker, Datetime } from 'vux';
import { getUserCarInfo, getCarBrand, getCarSeriesByBrand, getCarTypeBySeries, userChangeCarInfo } from '@/api/usercenter';
import { mapGetters } from 'vuex';
import { formatDate } from '@/common/js/date';

const HOT_NAME = '热门品牌';

export default {
    methods: {
        async initData() {
            // 设置当前时间
            let datetoday = new Date(); // 获取今天日期
            this.endDate = formatDate(datetoday, 'yyyy-MM-dd');
            // 获取当前车辆信息
            let vehicleId = this.$route.query.vehicleId;
            let carInfoResult = await getUserCarInfo(vehicleId);
            this.carInfo = carInfoResult.vehicle;
            // 初始化数据
            this.price.push(this.carInfo.priceRange);
            this.color.push(this.carInfo.color);
            // 获取所有车型
            let carBrandResult = await getCarBrand();
            this.carBrandData(carBrandResult);
        },
        chioceCarBrand() {
            this.$refs.modalbrand.show();
            setTimeout(() => {
                this.$refs.listview.refresh();
                this.$refs.listview._calculateHeight();
            }, 400);
        },
        selectCarSeries(item) {
            let carInfoParams = {};
            if (this.carInfo.manufacturerCode !== item.manufacturerCode || item.modelName !== this.carInfo.model) {
                 this.carInfo.yearVersion = carInfoParams.yearVersion = '';
            }
            this.carInfo.model = carInfoParams.model = item.modelName;
            this.carInfo.manufacturerCode = carInfoParams.manufacturerCode = item.manufacturerCode;
            this.changeCarInfo(carInfoParams);
            this.$refs.modalbrand.hide();
        },
        async chioceCarType() {
            this.carType = await getCarTypeBySeries(this.carInfo.manufacturerCode, this.carInfo.model);
            this.$refs.modalcartype.show();
        },
        async selectCarType(item) {
            let carInfoParams = {};
            carInfoParams.yearVersion = this.carInfo.yearVersion = item.yearVersion;
            carInfoParams.lyId = this.carInfo.lyId = item.lyId;
            this.changeCarInfo(carInfoParams);
            this.$refs.modalcartype.hide();
        },
        async changeCarInfo(params, tochange) {
            if (tochange) {
                this.carInfo.frameNumber = params.frameNumber;
                this.carInfo.engineNumber = params.engineNumber;
                this.carInfo.lastMileage = params.lastMileage;
            }
            let vehicleId = this.$route.query.vehicleId;
            let changeResult = await userChangeCarInfo(vehicleId, params);
            if (changeResult) {
                this.$vux.toast.show({
                    text: '修改成功',
                    position: 'bottom',
                    type: 'text',
                    width: '8.8em'
                });
            }
            this.$refs.submitCarinfo.back();
        },
        onChangeColor(value) {
            if (this.carInfo.color === value[0] || value[0] === '--请选择--') {
                return;
            }
            let carInfoParams = {};
            carInfoParams.color = this.carInfo.color = value[0];
            this.changeCarInfo(carInfoParams);
        },
        onChangePrice(value) {
            if (this.carInfo.priceRange === value[0] || value[0] === '--请选择--') {
                return;
            }
            let carInfoParams = {};
            carInfoParams.priceRange = this.carInfo.priceRange = value[0];
            this.changeCarInfo(carInfoParams);
        },
        onChangeLicense(value) {
           if (this.carInfo.licenseDate === value) {
                return;
            }
            let carInfoParams = {};
            this.carInfo.licenseDate = value;
            value = value.indexOf('00:00:00') < 0 ? value + ' 00:00:00' : value;
            carInfoParams.licenseDate = value;
            this.changeCarInfo(carInfoParams);
        },
        onChangeInsurance(value) {
            if (this.carInfo.insuranceDate === value) {
                return;
            }
            let carInfoParams = {};
            this.carInfo.insuranceDate = value;
            value = value.indexOf('00:00:00') < 0 ? value + ' 00:00:00' : value;
            carInfoParams.insuranceDate = value;
            this.changeCarInfo(carInfoParams);
        },
        async next(item) {
            if (this.carInfo.brandCode !== item.code) {
                let carInfoParams = {};
                this.carInfo.model = carInfoParams.model = '';
                this.carInfo.brandSeries = carInfoParams.brandSeries = item.name;
                this.carInfo.brandCode = carInfoParams.brandCode = item.code;
                this.changeCarInfo(carInfoParams);
            }
            // 根据品牌获取车系
            this.carSeries = await getCarSeriesByBrand(item.code);
            this.hasBack = true;
        },
        toChange(title) {
            this.subTitle = title;
            this.$refs.submitCarinfo.show();
        },
        backpage() {
            this.hasBack = false;
        },
        carBrandData(data) {
            let map = {
                hot: {
                    title: HOT_NAME,
                    items: []
                }
            };
            data.forEach((item, index) => {
                if (item.hot) {
                    map.hot.items.push({
                        name: item.name,
                        code: item.brandCode,
                        url: item.logUrl
                    });
                }
                let key = item.firstPinYin.substr(0, 1);
                if (!key.match(/[a-zA-Z]/)) {
                    key = '#';
                    map[key] = {
                        title: key,
                        items: []
                    };
                } else if (!map[key]) {
                    map[key] = {
                        title: key,
                        items: []
                    };
                }
                map[key].items.push({
                    name: item.name,
                    code: item.brandCode,
                    url: item.logUrl
                });
            });
            let hot = [];
            let ret = [];
            let other = [];
            for (let key in map) {
                let val = map[key];
                if (val.title.match(/[a-zA-Z]/)) {
                    ret.push(val);
                } else if (val.title === HOT_NAME) {
                    hot.push(val);
                } else {
                    other.push(val);
                }
            }
            ret.sort((a, b) => {
                return a.title.charCodeAt(0) - b.title.charCodeAt(0);
            });
            this.carBrand = hot.concat(ret).concat(other);
        }
    },
    beforeRouteLeave (to, from, next) {
        if (this.$refs.modalbrand.showFlag) {
            this.$refs.modalbrand.hide();
        } else if (this.$refs.modalcartype.showFlag) {
            this.$refs.modalcartype.hide(); this.$refs.modalcartype.hide();
        } else if (this.$refs.submitCarinfo.showFlag) {
            this.$refs.submitCarinfo.back();
        } else {
            next();
        }
    },
    created() {
        this.initData();
    },
    computed: {
        ...mapGetters([
            'storeId'
        ])
    },
    filters: {
        carMileage(mile) {
            let mileResult = mile || 0;
            return mileResult;
        }
    },
    data() {
        return {
            // 用户车辆信息
            carInfo: {},
            // 所有品牌
            carBrand: [],
            // 所有车系
            carSeries: [],
            // 所有车型
            carType: [],
            // 价格
            price: [],
            // 颜色
            color: [],
            // 设置车架号等页面标题
            subTitle: '',
            // 设置当前时间
            endDate: '',
            // 下一级页面
            hasBack: false,
            prices: [['--请选择--', '5万以下', '5-8万', '8-10万', '10-15万', '15-20万', '20-25万', '25-35万', '35-50万', '50-100万', '100万以上']],
            colors: [['--请选择--', '黑色', '白色', '银灰色', '深灰色', '香槟色', '咖啡色', '红色', '蓝色', '黄色', '其他']]
        };
    },
    components: {
        XHeader,
        Scroll,
        PopupPicker,
        Datetime,
        Modal,
        listview,
        UserReviseCarinfoSubmmit
    }
};
</script>

<style lang="stylus">
.user-revise-carinfo
    position: fixed
    top: 0
    bottom: 0
    left: 0
    width: 100%
    background: #fff
    z-index: 999
    .carinfo-scroll-box
        position: absolute
        top: 47px
        bottom: 0
        left: 0
        width: 100%
        overflow: hidden
    .user-carno
        width: 100%
        height: 54px
        line-height: 24px
        box-sizing: border-box
        padding: 10px 15px
        display: flex
        border-bottom: 10px solid #f0f1f2
        .title
            flex: 0 0 112px
            width: 112px
            box-sizing: border-box
            padding-left: 30px
            background: url(./img/icon_carno@2x.png) no-repeat left center
            background-size: 20px 18px
        .carno
            flex: 1
            color: #fe3f51
    .user-carinfo-content
        width: 100%
        height: auto
        overflow: hidden
        box-sizing: border-box
        padding: 4px 15px
        .user-carinfo-item
            width: 100%
            height: 30px
            line-height: 30px
            padding: 10px 0
            border-bottom: 1px solid #ececec
            display: flex
            .weui-cell
                width: 100%
                height: 100%
                display: flex
                padding: 0
            .title, .weui-cell__hd
                flex: 0 0 60px
                width: 60px
                height: 100%
            .value, .vux-cell-primary
                flex: 1
                height: 100%
                box-sizing: border-box
                padding-right: 14px
                background: url(../img/icon_right@2x.png) no-repeat right center
                background-size: 8px 12px
                text-align: right
        .vux-cell-value
            color: #000
        .weui-cell_access .weui-cell__ft:after, .weui-cell__ft, .vux-cell-box:not(:first-child):before
            display: none
    .car-series, .car-type
        width: 100%
        position: absolute
        top: 0
        left: 0
        bottom: 0
        background: #fff
        z-index: 31
        overflow: hidden
        .car-series-item, .car-type-item
            line-height: 24px
            width: 100%
            box-sizing: border-box
            padding-left: 12px
        .active
            color: #f00
.slide-enter-active, .slide-leave-active
    transition: all 0.3s
.slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
