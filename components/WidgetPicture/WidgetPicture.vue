<template>
    <view class="picture" :style="{
        height: item.style.height*2+'rpx',
        width: item.style.width*2+'rpx',
        left: item.style.left*2+'rpx',
        top: item.style.top*2+'rpx',
        border: item.style.border,
        opacity: item.style.opacity,
        zIndex: item.style.zIndex,
        borderRadius: item.style.borderRadius*2 + 'rpx',
        background: item.style.background}">
        <image class="img" mode="aspectFill" v-if="item.content.src" :src="item.content.src"/>
    </view>
</template>
<script>
    export default {
        props: ['item'],
        methods: {
            onClick(v){
                console.log('click',this.item.content)
				this.$emit('goto', this.item.content.chooseLink)
        	}
        }
    }
</script>

<style scoped>
    .img{
        height: 100%;
        width: 100%;
    }
    .picture{
        position: absolute;
        overflow: hidden;
    }

</style>
