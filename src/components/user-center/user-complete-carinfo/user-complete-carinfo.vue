<template>
    <transition name="slide">
        <div class="user-complete-carinfo">
            <x-header :left-options="{backText: ''}">选择车辆</x-header>
            <div class="user-carlist">
                <div class="user-caritem" v-for="caritem in carList" :key="caritem.id"  @click="toReviseCar(caritem.id)">
                    {{ caritem.number }}
                </div>
            </div>
            <router-view></router-view>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
    import { XHeader } from 'vux';
    import { getUserLicenses } from '@/api/usercenter';
    import { routerMixin } from '@/common/js/mixin';

    export default {
        mixins: [routerMixin],
        methods: {
            async initData() {
                let userCarListResult = await getUserLicenses();
                this.carList = userCarListResult.result;
            },
            toReviseCar(vehicleId) {
                this.$router.push({
                    path: '/userReviseCarinfo',
                    query: {
                        vehicleId: vehicleId
                    }
                });
            }
        },
        created() {
            this.initData();
        },
        data() {
            return {
                carList: []
            };
        },
        components: {
            XHeader
        }
    };
</script>

<style scoped lang="stylus">
.user-complete-carinfo
    position: fixed
    top: 0
    bottom: 0
    left: 0
    width: 100%
    background: #fff
    z-index: 99
    .user-carlist
        position: absolute
        top: 46px
        bottom: 0
        left: 0
        width: 100%
        .user-caritem
            padding: 0 10px
            border-bottom: 1px solid #ececec
            line-height: 40px
            background: url(./img/icon_right@2x.png) no-repeat right 10px center
            background-size: auto 35%
            &:last-child
                border-bottom: 0
.slide-enter-active, .slide-leave-active
    transition: all 0.3s
.slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
