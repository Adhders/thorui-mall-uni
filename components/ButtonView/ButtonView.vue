<template>
    <view>
        <view class="button" :style="{
            height: item.style.height*2+'rpx',
            width: item.style.width*2+'rpx',
            border: item.style.border,
            lineHeight: (item.style.height-2)*2+'rpx',
            left: item.style.left*2 + 'rpx',
            top: item.style.top*2+ 'rpx',
            color: item.style.color,
            background: item.style.background}">
            <view class='image' v-if=item.content.src :style="{opacity: item.style.transparency/100}">
                <image class="img" mode="aspectFill" :src=item.content.src alt=''/>
            </view>
            <view class="content" :class="{
                bold: item.style.isBold,
                italic: item.style.isItalic,
                delete: item.style.isDelete,
                underline: item.style.isUnderline}" :style="{fontSize: parseInt(item.style.fontSize)*2 + 'rpx'}">
                <text>{{item.content.title}}</text>
			</view>
        </view>
    </view>
</template>

<script>
    export default{
        props: ['item'],
        methods: {
            onload(){
                console.log('button',item)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .button {
        position: relative;
        .image {
            height: 100%;
            .img {
                width: 100%;
                height: 100%;
            }
        }
        .content {
            text-align: center;
        }
        .italic {
            font-style: italic;
        }
        .bold {
            font-weight: 700;
        }
        .underline {
            text-decoration: underline;
        }
        .delete {
            text-decoration: line-through;
        }
        .delete.underline {
            text-decoration: underline line-through;
        }
    }
</style>
