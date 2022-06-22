<template>
    <view :style="{
        marginTop: item.style.topMargin*2 + 'rpx',
        marginBottom: item.style.bottomMargin*2+ 'rpx',
        color: item.style.color,
        backgroundColor: item.style.backgroundColor}">
        <view class="displayBox">
            <view class="nav-item" v-for="(img,index) in item.tablist1" :key="index">
                <image mode="aspectFill" :src="img.src"  @click="onClick(img)" :style="{
                    width: item.style.imgSize*2 + 'rpx',
                    height: item.style.imgSize*2 + 'rpx' }"/>
                <view class="nav-title">{{img.title}}</view>
            </view>
        </view>
        <view class="displayBox row">
            <view class="nav-item" v-for="(img,index) in item.tablist2" :key="index">
                <image mode="aspectFill" :src="img.src" @click="onClick(img)" :style="{
                    width: item.style.imgSize*2 + 'rpx',
                    height: item.style.imgSize*2 + 'rpx' }"/>      
                <view class="nav-title">{{img.title}}</view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        props: ['item'],
        methods:{
            onClick(v){
				this.$emit('goto', v.chooseLink)
        	}
        }
    }
</script>

<style lang="scss" scoped>
    .displayBox{
        display: flex;
        justify-content: space-around;
    }
    .displayBox.row .nav-item{
        margin-top: 20rpx;
    }
    .nav-item{
        display: flex;
        align-items: center;
        flex-flow: column;
        .nav-title{
            letter-spacing: 0;
            width: 120rpx;
            text-align: center;
            font-size: 24rpx;
        }
    }
</style>
