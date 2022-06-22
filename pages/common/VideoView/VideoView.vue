<template>
    <view :style="{
            paddingRight: item.style.pageMargin*2 + 'rpx',
            paddingLeft: item.style.pageMargin*2 + 'rpx',
            marginBottom: item.style.bottomMargin*2 + 'rpx',
            marginTop: item.style.topMargin*2 + 'rpx',
            height: item.style.scale==0? width + 'px': item.style.height*2 + 'rpx'
        }">
        <view @tap="preview(src)" class="container" :style="{borderRadius: item.style.borderRadius + 'px'}">
            <video id="videoView" class="video"  @timeupdate="timeupdate" @ended.stop="onEnd()" controls
                :show-center-play-btn="false" src="http://www.w3school.com.cn/i/movie.ogg" :muted="ismute" :autoplay="item.style.autoplay">
            </video>
            <view class="icon-play" @tap.stop="onPlay" v-if="startVideo">
                <image class='img' src="https://system.chuangbiying.com/assets/play.svg" mode=""></image>
            </view>
            <tui-slider class="tui-video-slider" :height="2"  :blockHeight="0" :blockWidth="0"
               backgroundColor="#ccc" activeColor="#fff" :value="currentTime" :max="duration" :width="width">
            </tui-slider>
            <view class="goto-center" v-if="item.style.guide==0" @tap.stop="onDetail">
                <text class="lead-btn" style="color:#fff">
                    {{(item.content.buttonText==='')?'详情':item.content.buttonText}}
                </text>
                <tui-icon name="arrowright" :size="16" color="#fff"></tui-icon>
            </view>
            <view class="tui-video-voice" @tap.stop="onChange">
                <tui-tag padding="6rpx 18rpx" type="translucent" shape="circle" :scaleMultiple="0.82" originRight>
                    <image :src="voiceControl" mode=""></image>
                </tui-tag>
            </view>
        </view>
    </view>
</template>
<script>
    export default {
        props: ['item'],
        data(){
            return {
                src: '',
                width: 750,
                ismute: true,
                duration: '',
                currentTime: '',
                videoplayObj: {}, //video对象
                playing: true, // 是否正在播放视频
                startVideo: true, //中间播放按钮
                voiceControl: "https://system.chuangbiying.com/assets/mute.svg"
            }
        },
        mounted(){
            this.src = this.item.content.videoList[0].src
            this.width = uni.upx2px(750-this.item.style.pageMargin*4)
            setTimeout(() => {
                if(this.item.style.autoplay){
                    this.startVideo = false
                }
			}, 600);
        },
        methods:{
            onPlay() {
                console.log('onplay')
				this.startVideo = false
                this.videoplayObj = wx.createVideoContext('videoView')
				// this.playing = true
                console.log('obj', this.videoplayObj)
				// this.videoplayObj.play()
                this.videoplayObj.play()
			},
            playVideo(){
                console.log('play')
            },
            onEnd() {
                console.log('end')
                this.startVideo = true
                // this.playing = false
            },
            onChange(){
                this.ismute = !this.ismute
                this.voiceControl = this.ismute? 'https://system.chuangbiying.com/assets/mute.svg' : 'https://system.chuangbiying.com/assets/volume.svg'
            },
			timeupdate(e){
				this.duration = parseInt(e.detail.duration)
				this.currentTime = parseInt(e.detail.currentTime)
			},
            preview(url) {
                // uni.navigateTo({
                //     url: '/pages/index/video/video?videoUrl=' + url,
                //     animationType: 'zoom-out'
                // })
                // this.videoplayObj.pause()
                // this.startVideo = true
            },
            onDetail(){
                console.log('detail')
                this.tui.toast('detail')
            },
        }
    }
</script>

<style lang="less" scoped>

    .container {
        height: 100%;
        position: relative;
        overflow: hidden;
        background: #000;
        text-align: center;
        .goto-center {
            position: absolute;
            display: flex;
            cursor: pointer;
            top: 30rpx;
            right: 10rpx;
            color: #fff;
            font-size: 24rpx;
            height: 20rpx;
            line-height: 20rpx;
            padding: 10rpx 10rpx 10rpx 20rpx;
            border: 2rpx solid #fff;
            border-radius: 24rpx;
            background-color: rgba(0, 0, 0, 0.2);
        }
        .video, .img{
            width: 100%;
            height: 100%;
        }
    }

    .icon-play{
        transform: translate(-50%,-50%);
        width: 80rpx;
        height: 80rpx;
        cursor: pointer;
        display: inline-block;
        position: absolute;
        opacity: 0.8;
        top: 50%;
        left: 50%;
    }
    .tui-video-slider{
		position: absolute;
		bottom: -4px;
	}
    .tui-video-voice {
        position: absolute;
        color: #fff;
        cursor: pointer;
        bottom: 40rpx;
        right: 15rpx;
        image {
            width: 38rpx;
            height: 38rpx;
            z-index: 999;
        }
	}

</style>
