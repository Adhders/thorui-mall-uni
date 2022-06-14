<template>
    <view :style="{
        padding: '10rpx 0',
        marginTop: item.style.topMargin*2 + 'rpx',
        marginBottom: item.style.bottomMargin*2+ 'rpx',
    }">
        <tui-searchbar @search="onSearch" :cancel="false"
             :backgroundColor=item.style.theme
             padding="10rpx 30rpx"
             :height="item.style.height*2 + 'rpx'"
             :color=item.style.textColor
             :inputBgColor=item.style.backgroundColor
             :focus="item.style.textAlign==='left'"
             :radius="item.style.borderRadius*2 + 'px'"
             :value=item.content>
        </tui-searchbar>
    </view>
</template>

<script>
    export default {
        props: ['item'],
        methods: {
            onSearch(e){
                console.log('serarch', e)
                uni.navigateTo({
					url: '/pages/index/productList/productList'
				});
            }
        }
    }
</script>

<style scoped>
</style>
