<template>
    <view :class="['video', {full: item.style.scale==='0','margin': item.style.pageMargin!=='0'} ]" :style="{
            borderRadius: item.style.borderRadius*2+ 'rpx',
            marginRight:  item.style.pageMargin*2 + 'rpx',
            marginLeft: item.style.pageMargin*2 + 'rpx',
            marginBottom: item.style.bottomMargin*2 + 'rpx',
            marginTop: item.style.topMargin*2 + 'rpx'
        }">
        <view class="container">
            <swiper class="screen-swiper" :style="{height: item.style.height*2 + 'rpx'}">
                <swiper-item v-for="(video,index) in item.style.type==='local'? item.content.localSource: item.content.externalSource" :key="index">
                    <video :src=video.src :poster=video.url width="100%" autoplay controls objectFit="cover"></video>
                </swiper-item>
            </swiper>
        </view>
    </view>
</template>
<script>

export default {
    props: ['item'],
    methods:{
        change(index) {
				this.swiperCurrent = index
				this.current = index;
			},
        // swiper改变
        onchange(e) {
            this.swiperCurrent = e.detail.current
            this.current = e.detail.current
        },

    }
}
</script>

<style lang="less" scoped>
    uni-video{
        width: 100%;
        height: 100%;
    }
    .video{
        position: relative;
        background: #000;
        overflow: hidden;
        .container {
            .text-center {
                position: absolute;
                display: flex;
                top: 30rpx;
                right: 10rpx;
                color: #fff;
                white-space: nowrap;
                font-size: 24rpx;
                line-height: 20rpx;
                padding: 10rpx 10rpx 10rpx 18rpx;
                border: 1px solid #fff;
                border-radius: 24px;
                background-color: rgba(0, 0, 0, 0.2);
            }
        }
    }
    .video.full{
        height: 750rpx;
        .empty,.container{
            position: relative;
            top: 50%;
            transform: translate(0px, -50%);
        }
    }
    .video.full.margin{
        height: 705rpx;
    }
</style>
