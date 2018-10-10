<template>
    <div class="no-result" v-if="list.length === 0 && !indexkey">
        <img class="icon_noresult" src="./icon_noresult.png" />
    </div>
</template>

<script type="text/ecmascript-6">
export default {
    props: {
        list: {
            type: Array,
            default: () => []
        },
        indexkey: {
            type: Boolean,
            default: false
        }
    }
};
</script>

<style scoped lang="stylus">
.no-result
    width: 100%
    position: absolute
    top: 0
    bottom: 0
    left: 0
    overflow: hidden
    background: #fff
    .icon_noresult
        width: 88px
        position: absolute
        top: 100px
        left: 50%
        margin-left: -44px
</style>
