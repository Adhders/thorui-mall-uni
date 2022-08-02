<template>
    <view :style="{
        paddingTop: item.style.topMargin*2 + 'rpx',
        paddingBottom: item.style.bottomMargin*2+ 'rpx',
        backgroundColor: item.style.theme,
    }">
        <tui-searchbar :cancel="false" @focus="onfocus"
            :backgroundColor=item.style.theme
            padding="10rpx 30rpx"
            :height="item.style.height*2 + 'rpx'"
            :color=item.style.textColor
            :inputBgColor=item.style.backgroundColor
            :radius="item.style.borderRadius*2 + 'px'"
            :placeholder="item.content">
        </tui-searchbar>
    </view>
</template>

<script>
    export default {
        props: ['item'],
        methods: {
            onfocus(e){
                uni.navigateTo({
					url: '/pages/common/search/search'
				});
            }
        }
    }
</script>

<style scoped>
</style>
