<template>
	<view class="container">
		<video class="tui-video" id="tui-video" :src="videoUrl" controls>
		</video>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				videoUrl: '',
			}
		},
		onLoad(options){
			this.videoUrl = options.videoUrl
			console.log('currentTime', options.currentTime)
			// #ifdef MP-WEIXIN
			this.videoplayObj = wx.createVideoContext('tui-video')
			this.videoplayObj.play()
			this.videoplayObj.seek(parseInt(options.currentTime))
			// #endif
		},
		methods: {
			
		}
	}
</script>

<style>
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
</style>
