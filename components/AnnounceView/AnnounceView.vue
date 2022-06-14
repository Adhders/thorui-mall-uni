<template>
	<view :class="{notice: item.style.type!=='icon'}">
		<u-notice-bar
		 :no-list-hidden=false
		 padding="10rpx 0"
		 font-size="24"
         :autoplay="item.style.status==='auto'"
		 :speed="item.style.velocity==='3000'?350 : item.style.velocity==='5000'? 160 : 50"
         :duration="item.style.velocity==='3000'? 400 : item.style.velocity==='5000'? 2000: 6000"
		 :mode=item.style.orientation
		 :type=item.style.theme
		 :list=item.newsList
		 :color="item.style.theme==='custom'? item.style.color : '' "
		 :bg-color="item.style.theme==='custom'? item.style.backgroundColor : '' "
		 :moreIcon=item.style.moreIcon
         :volumeIcon="item.style.type==='icon'"
         @getMore="getMore"
		></u-notice-bar>
	</view>
</template>

<script>
	export default {
		props: ['item'],
        methods: {
		    getMore(v){
            }
        }
	}
</script>

<style scoped>
	.notice /deep/ .u-notice-box{
		margin-left: 0;
	}
</style>
