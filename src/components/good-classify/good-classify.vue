<template>
    <div class="good-classify">
        <x-header :left-options="{backText: '',preventGoBack: true,showBack: false}" overwrite-left="">商城分类</x-header>
        <div class="good-search">
			<div class="good-search-input">
				<div class="search-input">
					<input @keypress="searchGoods" class="search-text" type="text" placeholder="请输入商品名称" v-model='searchText' id="searchInput"/>
					<span class="icon_search" @click="search"></span>
				</div>
			</div>
		</div>
        <div class="good-classify-box">
            <scroll class="menu-wrapper" :data="modelList">
                <ul class="menu-list">
                    <li class="menu-item" @click="selectMenu(-1)" :class="{'active':currentIndex===-1}">
						<p class="ellipsis">全部</p>
					</li>
					<li class="menu-item" v-for="(item, index) in modelList" @click="selectMenu(index, item.id)" :class="{'active':currentIndex===index}" :key="item.id">
						<p class="ellipsis">{{ item.name }}</p>
					</li>
                </ul>
            </scroll>
            <scroll class="goodslist-wrapper" :data="goodsList" :pullup="pullup" :pulldown="pulldown" @pulldown="refresh" @pullup="getMoreGood" ref="goodsClassify">
                <ul>
                    <li v-for="good in goodsList" :key="good.id"  class="goods-item-box">
                        <good-item :goods="good" :hidebtn="false" @toDetail="toDetail"></good-item>
                    </li>
                </ul>
             </scroll>
        </div>
        <router-view></router-view>
    </div>
</template>

<script type="text/ecmascript-6">
import { XHeader } from 'vux';
import { mapGetters } from 'vuex';
import { getModel, getClassifyGoods } from '@/api/classify';
import Scroll from '@/components/base/scroll/scroll';
import GoodItem from '@/components/base/good-item/good-item';

const SORT_TYPE = 'DATE_TIME_DESC';
const PAGESIZE = 8;

export default {
    methods: {
        searchGoods(event) {
            console.log(event);
            if (event.keyCode === 13) {
                event.preventDefault();
                this.getGood();
            }
        },
        search() {
            this.getGood();
        },
        async getGood() {
            this.pageNum = 0;
            let classifyGoodsResult = await getClassifyGoods(this.modelId, this.searchText, this.storeId, this.pageNum, PAGESIZE, SORT_TYPE);
            this.goodsList = classifyGoodsResult.content;
            this.checkMore(classifyGoodsResult);
        },
        selectMenu(index, id) {
            document.getElementById('searchInput').blur();
            if (this.currentIndex === index) {
                return;
            }
            this.searchText = '';
            this.currentIndex = index;
            this.modelId = id || '';
            this.$refs.goodsClassify.reset();
            this.getGood();
        },
        // 初始化数据
        async initData() {
            // 请求分类列表
            let modelResult = await getModel(this.storeId);
            this.modelList = modelResult;
            // 请求分类商品列表数据
            let classifyGoodsResult = await getClassifyGoods(this.modelId, this.searchText, this.storeId, this.pageNum, PAGESIZE, SORT_TYPE);
            this.goodsList = classifyGoodsResult.content;
            this.checkMore(classifyGoodsResult);
        },
        refresh() {
            setTimeout(() => {
                this.getGood();
            }, 1000);
        },
        async getMoreGood() {
            if (!this.loadMore) {
                this.$refs.goodsClassify.forceUpdate(true);
                return;
            }
            this.pageNum++;
            let classifyGoodsResult = await getClassifyGoods(this.modelId, this.searchText, this.storeId, this.pageNum, PAGESIZE, SORT_TYPE);
            this.goodsList = this.goodsList.concat(classifyGoodsResult.content);
            setTimeout(async () => {
                this.checkMore(classifyGoodsResult);
            }, 1000);
        },
        checkMore(data) {
            this.loadMore = !data.isLast;
            this.$refs.goodsClassify.forceUpdate(data.isLast);
            this.$vux.loading.hide();
        },
        toDetail(id) {
            this.$router.push({
                path: `/goodClassify/${id}`
            });
        }
    },
    created() {
        this.initData();
    },
    data() {
        return {
            searchText: '',
            // 分类id
            modelId: '',
            // 分类列表数据
            modelList: [],
            // 商品数据列表
            goodsList: [],
            // 左侧分类菜单选择下标
            currentIndex: -1,
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
    computed: {
        ...mapGetters([
            'storeId'
        ])
    },
    components: {
        XHeader,
        Scroll,
        GoodItem
    }
};
</script>

<style scoped lang="stylus">
.good-classify
    width: 100%
    position: fixed
    top: 0
    left: 0
    bottom: 53px
    background: #ffffff
    z-index: 2
    .good-search
        background: #eeeeee
        position relative
        .good-search-input
            width: 100%
            padding: 10px 16px
            margin: 0 auto
            display: flex
            box-sizing: border-box
            .search-input
                border: 1px solid #ececec
                border-radius: 4px
                flex: 1
                display: flex
                background: #fff
                .search-text
                    line-height: 32px
                    border-radius: 5px 0 0 5px
                    flex: 1
                    padding: 0px 10px
                    outline: none
                .icon_search
                    flex: 0 0 30px
                    width: 30px
                    height: 32px
                    background: url(./img/icon_search.png) no-repeat 2px center
                    background-size: 68% 60%
    .good-classify-box
        width: 100%
        position: absolute
        top: 101px
        bottom: 0
        left: 0
        display: flex
        .menu-wrapper
            flex: 0 0 90px
            width: 90px
            overflow: hidden
            position: relative
            .menu-list
                width: 100%
                .menu-item
                    width: 86px
                    height: 55px
                    line-height: 55px
                    border-bottom: 1px solid #d9d9d9
                    border-left: 4px solid transparent
                    text-align: center
                    background: #f5f5f5
                    &:last-child
                        border-bottom: 0
                .active
                    color: #FE6471
                    background: white
                    border-left-color: #FE3F51
        .goodslist-wrapper
            flex: 1
            overflow: hidden
            position: relative
</style>
