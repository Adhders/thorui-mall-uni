<template>
	<view class="container" @tap="onPause()">
		<video class="tui-video" id="tui-video" @timeupdate="timeupdate" :src="videoUrl" autoplay controls @ended="endedFun()" 
		:show-play-btn="false" :show-fullscreen-btn="false" :show-center-play-btn="false">
		</video>
		<view class="video-img" @tap.stop="videoPlay()" v-if="startVideo">
			<image src="https://system.chuangbiying.com/assets/img/video-play.png" mode=""></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				videoUrl: '',
				playing: true, // 是否正在播放视频
				startVideo: true, //中间播放按钮
				currentTime: '',
			}
		},
		onLoad(options){
			this.videoUrl = options.videoUrl
			// #ifdef MP-WEIXIN
			this.videoplayObj = wx.createVideoContext('tui-video')
			this.videoplayObj.play()
			this.videoplayObj.seek(parseInt(options.currentTime))
			// #endif
			setTimeout(() => {
				this.startVideo = false
			}, 600);
		},
		methods: {
			endedFun() {
				this.startVideo = true
				this.playing = false
			},
			videoPlay() {
				this.startVideo = false
				this.videoplayObj.play()
			},
			onPause(){
				this.videoplayObj.pause()
				this.startVideo = true
			},
			timeupdate(e){
				this.currentTime = parseInt(e.detail.currentTime)
			},
			
		},
		 onUnload() {
			 uni.setStorageSync('currentTime', this.currentTime)
			 uni.setStorageSync('playState', !this.startVideo)
		},
	}
</script>

<style lang="less">
	page,.container{
		height: 100%;
		background-color: #000000;
	}
    .container{
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.tui-video{
		width: 100%;
		height: 100%;
	}
	.video-img {
		display: inline-block;
		width: 90upx;
		height: 90upx;
		position: absolute;
		bottom: 0;
		left: 50%;
		top: 50%;
		transform: translateX(-50%) translateY(-50%);
		image {
			width: 90upx;
			height: 90upx;
			z-index: 999;
			opacity: 0.5;
		}
	}
</style>
